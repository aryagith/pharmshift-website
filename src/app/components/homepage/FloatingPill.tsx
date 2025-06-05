// src/app/components/FloatingPill.tsx
"use client";
import React from "react";

export default function FloatingPill() {
  return (
    <div
      style={{
        position: "fixed",
        top: "25%",
        right: "3vw",
        width: "520px",
        zIndex: 0,
        animation: "pillFadeIn 2s", // Use a static animation name
        pointerEvents: "none",
      }}
    >
      <img src="/pill.png" alt="pill" style={{ width: '100%', height: 'auto', opacity:'0.7'}}  />
    </div>
  );
}