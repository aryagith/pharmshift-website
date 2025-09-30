import React, { useMemo, useRef, FC, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration ---
const CONFIG = {
  pillLength: 0.7,
  pillRadius: 0.3,
  dotRows: 42, // reduced from 48
  dotCols: 42, // reduced from 96
  dotRadius: 0.009,
  waveAmplitude: 0.07,
  waveFrequency: 1.5,
  waveSpeed: 0.2,
  dotColor: '#fff',
  pillColor: '#0077ff',
  dotScaleFactor: 0.02, // how much the dot increases by closer to the waves
};

const GRADIENT_COLORS = [
  '#2563eb', // deep blue
  '#3b82f6', // blue
  '#60a5fa', // light blue
];

// Helper: Get a point on a capsule (pill) surface with correct mapping
function getCapsuleSurfacePoint(
  u: number,
  v: number,
  length: number,
  radius: number
) {
  // u: [0, 1] along the length, v: [0, 1) around the pill
  const theta = v * Math.PI * 2;
  const half = length / 2;
  const domeFrac = radius / (length + 2 * radius); // fraction of u for each dome

  if (u < domeFrac) {
    // Bottom dome (hemisphere)
    const phi = Math.PI - (u / domeFrac) * (Math.PI / 2); // from pi to pi/2
    return new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi) * radius,
      -half + Math.cos(phi) * radius,
      Math.sin(theta) * Math.sin(phi) * radius
    );
  } else if (u > 1 - domeFrac) {
    // Top dome (hemisphere)
    // Correct: phi should go from pi/2 (at cylinder) to pi (at tip)
    const phi = Math.PI / 2 + ((u - (1 - domeFrac)) / domeFrac) * (Math.PI / 2);
    return new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi) * radius,
      half - Math.cos(phi) * radius,
      Math.sin(theta) * Math.sin(phi) * radius
    );
  } else {
    // Cylinder
    const y = (u - domeFrac) / (1 - 2 * domeFrac) * length - half;
    return new THREE.Vector3(
      Math.cos(theta) * radius,
      y,
      Math.sin(theta) * radius
    );
  }
}

function getGradientColor(t: number) {
  // t: 0 (bottom) to 1 (top)
  if (t < 0.5) {
    // blend 0-1
    const f = t * 2;
    return new THREE.Color(GRADIENT_COLORS[0]).lerp(new THREE.Color(GRADIENT_COLORS[1]), f).getStyle();
  } else {
    // blend 1-2
    const f = (t - 0.5) * 2;
    return new THREE.Color(GRADIENT_COLORS[1]).lerp(new THREE.Color(GRADIENT_COLORS[2]), f).getStyle();
  }
}

// Generate a few random wave origins on the pill surface
function getRandomOrigins(num: number) {
  const origins = [];
  for (let i = 0; i < num; i++) {
    const u = Math.random();
    const v = Math.random();
    origins.push(getCapsuleSurfacePoint(u, v, CONFIG.pillLength, CONFIG.pillRadius));
  }
  return origins;
}

const WAVE_ORIGINS = getRandomOrigins(2); // 4 random origins

interface ThreeDPillProps {
  rotation?: number;
}

const AnimatedDotsPill: FC<{ rotation?: number }> = ({ rotation = 0 }) => {
  // Precompute dot positions and colors on the pill surface
  const dots = useMemo(() => {
    const arr: { base: THREE.Vector3; u: number; v: number; color: string }[] = [];
    for (let i = 0; i < CONFIG.dotRows; i++) {
      for (let j = 0; j < CONFIG.dotCols; j++) {
        const u = i / (CONFIG.dotRows - 1);
        const v = j / CONFIG.dotCols;
        arr.push({
          base: getCapsuleSurfacePoint(u, v, CONFIG.pillLength, CONFIG.pillRadius),
          u,
          v,
          color: getGradientColor(u),
        });
      }
    }
    return arr;
  }, []);

  // Animate dots using InstancedMesh for performance
  const meshRef = useRef<THREE.InstancedMesh>(null);
  // Store per-dot color for instanced mesh
  const colorArray = useMemo(() => {
    const arr = new Float32Array(dots.length * 3);
    for (let i = 0; i < dots.length; i++) {
      const color = new THREE.Color(dots[i].color);
      arr[i * 3 + 0] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [dots]);
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
    }
  }, [colorArray]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const period = 4;
    const envelope = 0.5 * (1 + Math.sin((t * 2 * Math.PI) / period - Math.PI / 2));
    const waveSpeed = CONFIG.waveSpeed;
    const peakSpread = 0.13;
    const maxHeight = CONFIG.waveAmplitude * envelope;
    const dummy = new THREE.Object3D();
    for (let idx = 0; idx < dots.length; idx++) {
      const dot = dots[idx];
      let elevation = 0;
      let maxPeak = 0;
      for (const origin of WAVE_ORIGINS) {
        const dist = dot.base.distanceTo(origin);
        const radius = (t * waveSpeed) % (CONFIG.pillLength + 2 * CONFIG.pillRadius);
        const peak = Math.exp(-Math.pow((dist - radius) / peakSpread, 2));
        elevation += peak * maxHeight;
        if (peak > maxPeak) maxPeak = peak;
      }
      elevation /= WAVE_ORIGINS.length;
      const normal = dot.base.clone().normalize();
      const pos = dot.base.clone().add(normal.multiplyScalar(elevation));
      dummy.position.copy(pos);
      const scale = 1 + CONFIG.dotScaleFactor * maxPeak;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(idx, dummy.matrix);
      // --- Glow effect: blend in lighter blue for dots near the wave peak ---
      const baseColor = new THREE.Color(getGradientColor(dot.u));
      const glowStrength = Math.min(1, maxPeak * 2.5); // sharper glow
      const glowColor = new THREE.Color(GRADIENT_COLORS[2]);
      const finalColor = baseColor.clone().lerp(glowColor, glowStrength * 0.8);
      colorArray[idx * 3 + 0] = finalColor.r;
      colorArray[idx * 3 + 1] = finalColor.g;
      colorArray[idx * 3 + 2] = finalColor.b;
    }
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  // Rotate the whole group to match the 2D pill's angle and scroll
  return (
    <group rotation={[-Math.PI / 6, 0, Math.PI / 6 + rotation]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, dots.length]}
      >
        <sphereGeometry args={[CONFIG.dotRadius, 8, 8]}>
          <instancedBufferAttribute
            attach="attributes.color"
            args={[colorArray, 3]}
          />
        </sphereGeometry>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={0.92}
          emissive={GRADIENT_COLORS[2]}
          emissiveIntensity={0.25}
        />
      </instancedMesh>
    </group>
  );
};

const ThreeDPill: FC<ThreeDPillProps> = ({ rotation = 0 }) => {
  // Use a React ref to store fall value and requestAnimationFrame for smooth updates
  const [fall, setFall] = React.useState(0);
  const targetFall = React.useRef(0);
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxFall = 0.7;
      targetFall.current = Math.min(scrollY / 2000, 1) * maxFall;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    let running = true;
    function animate() {
      setFall((prev) => {
        // Smoothly interpolate towards targetFall
        const diff = targetFall.current - prev;
        if (Math.abs(diff) < 0.0002) return targetFall.current;
        return prev + diff * 0.08; // slower, smoother interpolation
      });
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // The pill will always be visible, pinned to the viewport
  return (
    <div
      style={{
        position: 'fixed',
        right: '-8vw',
        top: `${fall * 100}vh`,
        width: '60vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'none', // disable CSS transition, use JS for smoothness
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        shadows={false}
        gl={{ alpha: true }}
        style={{ background: 'black', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <AnimatedDotsPill rotation={rotation} />
      </Canvas>
    </div>
  );
};

export default ThreeDPill;