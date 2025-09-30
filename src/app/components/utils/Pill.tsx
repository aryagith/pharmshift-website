import React, { FC, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type PillProps = {
  volume: number;         // 0..1 mic volume
  isListening: boolean;   // true when recording
  isPlayback: boolean;    // true when AI audio is playing
  canvasWidth?: number;
  canvasHeight?: number;
};

const CONFIG = {
  pillLength: 0.52,
  pillRadius: 0.26,
  dotRows: 44,
  dotCols: 94,
  dotRadius: 0.008,
  baseAmplitude: 0.07,
  calmAmplitude: 0.045,
  calmSpeed: 0.18,
  listenSpeed: 1.6,
  peakSpread: 0.12,
  threshold: 0.02,
  spawnCooldown: 0.05,
  maxBurst: 3,
};

const GRADIENT_COLORS = ['#2563eb', '#3b82f6', '#60a5fa'];

function getCapsuleSurfacePoint(u: number, v: number, length: number, radius: number) {
  const theta = v * Math.PI * 2;
  const half = length / 2;
  const domeFrac = radius / (length + 2 * radius);

  if (u < domeFrac) {
    const phi = Math.PI - (u / domeFrac) * (Math.PI / 2);
    return new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi) * radius,
      -half + Math.cos(phi) * radius,
      Math.sin(theta) * Math.sin(phi) * radius
    );
  } else if (u > 1 - domeFrac) {
    const phi = Math.PI / 2 + ((u - (1 - domeFrac)) / domeFrac) * (Math.PI / 2);
    return new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi) * radius,
      half - Math.cos(phi) * radius,
      Math.sin(theta) * Math.sin(phi) * radius
    );
  } else {
    const y = ((u - domeFrac) / (1 - 2 * domeFrac)) * length - half;
    return new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
  }
}

function getGradientColor(t: number) {
  if (t < 0.5) {
    const f = t * 2;
    return new THREE.Color(GRADIENT_COLORS[0]).lerp(new THREE.Color(GRADIENT_COLORS[1]), f);
  } else {
    const f = (t - 0.5) * 2;
    return new THREE.Color(GRADIENT_COLORS[1]).lerp(new THREE.Color(GRADIENT_COLORS[2]), f);
  }
}

function randomOrigins(count: number, len: number, rad: number) {
  const origins: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    origins.push(getCapsuleSurfacePoint(Math.random(), Math.random(), len, rad));
  }
  return origins;
}

type Wave = { origin: THREE.Vector3; start: number; type: 'listen' | 'playback' };

const AnimatedDotsPill: FC<PillProps> = ({ volume, isListening, isPlayback }) => {
  const dots = useMemo(() => {
    const arr: { base: THREE.Vector3; u: number; v: number; baseColor: THREE.Color; prevElevation: number }[] = [];
    const { dotRows, dotCols, pillLength } = CONFIG;

    for (let row = 0; row < dotRows; row++) {
      const u = (row + 0.5) / dotRows;

      for (let col = 0; col < dotCols; col++) {
        const v = col / dotCols;
        arr.push({
          base: getCapsuleSurfacePoint(u, v, pillLength, CONFIG.pillRadius),
          u,
          v,
          baseColor: getGradientColor(u),
          prevElevation: 0,
        });
      }
    }
    return arr;
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const colorArray = useMemo(() => new Float32Array(dots.length * 3), [dots.length]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const groupRef = useRef<THREE.Group>(null);

  const waves = useRef<Wave[]>([]);
  const listenOrigins = useRef<THREE.Vector3[]>(randomOrigins(4, CONFIG.pillLength, CONFIG.pillRadius));
  const playbackOrigins = useRef<THREE.Vector3[]>(randomOrigins(2, CONFIG.pillLength, CONFIG.pillRadius));
  const lastSpawn = useRef(0);
  const waveEnergy = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const attack = 0.4;
    const release = 0.05;
    const target = isListening ? volume : 0;
    waveEnergy.current += (target - waveEnergy.current) * (target > waveEnergy.current ? attack : release);

    const listenMaxHeight = Math.min(CONFIG.baseAmplitude * waveEnergy.current, 0.07);
    const playbackMaxHeight = CONFIG.calmAmplitude * (0.5 + 0.5 * Math.sin(t * 0.8));

    // Spawn waves
    if (isListening) {
      if (volume > CONFIG.threshold && t - lastSpawn.current > CONFIG.spawnCooldown) {
        const burst = Math.ceil(Math.min(CONFIG.maxBurst, 1 + volume * CONFIG.maxBurst));
        for (let i = 0; i < burst; i++) {
          const origin = listenOrigins.current[Math.floor(Math.random() * listenOrigins.current.length)];
          waves.current.push({ origin, start: t, type: 'listen' });
        }
        lastSpawn.current = t;
      }
    } else if (isPlayback) {
      if (waves.current.filter((w) => w.type === 'playback').length < 2) {
        for (let i = waves.current.filter((w) => w.type === 'playback').length; i < 2; i++) {
          const origin = playbackOrigins.current[i % playbackOrigins.current.length];
          waves.current.push({ origin, start: t - i * 0.9, type: 'playback' });
        }
      }
    }

    const waveSpeed = (w: Wave) => (w.type === 'listen' ? CONFIG.listenSpeed : CONFIG.calmSpeed);
    const waveHeight = (w: Wave) => (w.type === 'listen' ? listenMaxHeight : playbackMaxHeight);

    // Apply idle tilt to group
    if (groupRef.current) {
      groupRef.current.rotation.x = -Math.PI / 6 + 0.05 * Math.sin(t * 0.3); // slightly increased
      groupRef.current.rotation.z = Math.PI / 6 + 0.05 * Math.cos(t * 0.3);
    }

    for (let idx = 0; idx < dots.length; idx++) {
      const dot = dots[idx];
      let elevation = dot.prevElevation;
      let maxPeak = 0;

      if (waves.current.length === 0) {
        // Idle motion + smooth decay
        const idle = 0.008 * Math.sin(t * 0.6 + dot.u * Math.PI * 2); // slightly increased amplitude
        const decay = 0.04;
        elevation += (idle - elevation) * decay;
      } else {
        let waveElev = 0;
        for (const w of waves.current) {
          const age = t - w.start;
          const radius = age * waveSpeed(w);
          const dist = dot.base.distanceTo(w.origin);
          const peak = Math.exp(-Math.pow((dist - radius) / CONFIG.peakSpread, 2));
          waveElev += peak * waveHeight(w);
          if (peak > maxPeak) maxPeak = peak;
        }
        elevation = dot.prevElevation * 0.8 + waveElev * 0.2;
      }

      const normal = dot.base.clone().normalize();
      const pos = dot.base.clone().add(normal.multiplyScalar(elevation));

      const scale = 1 + 0.015 * maxPeak;
      dummy.position.copy(pos);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(idx, dummy.matrix);

      // Glow pulse for idle
      const glowIntensity = 0.25 + 0.08 * Math.sin(t * 0.7 + idx * 0.1); // slightly stronger
      const glowColor = new THREE.Color(GRADIENT_COLORS[2]);
      const c = dot.baseColor.clone().lerp(glowColor, Math.min(1, maxPeak * glowIntensity));
      colorArray[idx * 3 + 0] = c.r;
      colorArray[idx * 3 + 1] = c.g;
      colorArray[idx * 3 + 2] = c.b;

      dot.prevElevation = elevation;
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
      (meshRef.current.geometry.getAttribute('color') as THREE.InstancedBufferAttribute).needsUpdate = true;
    }

    const maxTravel = CONFIG.pillLength + 2 * CONFIG.pillRadius + 0.2;
    waves.current = waves.current.filter((w) => t - w.start < maxTravel / waveSpeed(w));
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
    }
  }, [colorArray]);

  return (
    <group ref={groupRef}>
      <mesh>
        <capsuleGeometry args={[CONFIG.pillRadius, CONFIG.pillLength, 32, 64]} />
        <meshStandardMaterial
          color={GRADIENT_COLORS[1]}
          transparent
          opacity={0.22}
          depthWrite={false}
          roughness={0.25}
          metalness={0.65}
          emissive={GRADIENT_COLORS[2]}
          emissiveIntensity={0.18}
        />
      </mesh>

      <instancedMesh ref={meshRef} args={[undefined, undefined, dots.length]}>
        <sphereGeometry args={[CONFIG.dotRadius, 8, 8]} />
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={0.95}
          emissive={GRADIENT_COLORS[2]}
          emissiveIntensity={0.25}
        />
      </instancedMesh>
    </group>
  );
};

const Pill: FC<PillProps> = (props) => (
  <Canvas
    camera={{ position: [0, 0, 5], fov: 30 }}
    shadows={false}
    gl={{ alpha: true }}
    style={{ width: props.canvasWidth, height: props.canvasHeight }}
  >

    <ambientLight intensity={0.7} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} />
    <AnimatedDotsPill {...props} />
  </Canvas>
);

export default Pill;
