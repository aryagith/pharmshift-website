"use client";
import React, { useEffect, useState } from "react";

export default function FloatingPill() {
  const [rotation, setRotation] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fallY, setFallY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setRotation((y / 5) % 360);
      const maxFall = window.innerHeight * 0.8;
      setFallY(Math.min(y * 0.2, maxFall));
    };

    setTimeout(() => setVisible(true), 100);

    handleScroll(); // initial set
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamically merge scale + translate + rotate
  const combinedTransform = `
    translateY(${fallY}px)
    rotateZ(${rotation}deg)
    scale(${visible ? 1 : 0.9})
  `;

  return (
    <div className="floating-pill-container">
      <div className="pill-glow-layer" />
      <img
        src="/pill.png"
        alt="pill"
        className="floating-pill-image"
        style={{
          transform: combinedTransform,
          opacity: visible ? 0.9 : 0,
        }}
      />

      <style jsx>{`
        .floating-pill-container {
          position: fixed;
          top: 25%;
          right: 3vw;
          width: 520px;
          z-index: 0;
          pointer-events: none;
        }

        .pill-glow-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          filter: drop-shadow(0 0 30px rgba(0, 48, 94, 0.8));
        }

        .floating-pill-image {
          width: 100%;
          height: auto;
          transition: transform 0.4s ease-out, opacity 0.6s ease-in;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
