"use client";
import React, { useEffect, useState } from "react";

export default function FloatingPill() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollAmount = window.scrollY;
      setRotation((scrollAmount / 5) % 360);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="floating-pill-container">
      <div className="pill-glow-layer" />
      <img
        src="/pill.png"
        alt="pill"
        className="floating-pill-image"
        style={{
          transform: `rotateZ(${rotation}deg)`,
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
          background: transparent;
          z-index: -1;
          filter: drop-shadow(0 0 30px rgba(0, 48, 94, 0.8));
        }

        .floating-pill-image {
          width: 100%;
          height: auto;
          opacity: 0.9;
          transition: transform 0.1s linear;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
