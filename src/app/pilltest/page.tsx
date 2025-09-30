'use client';
import ThreeDPill from "../components/ThreeDPill";

export default function PillTestPage() {
  return (
    <div style={{ height: '200vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ position: 'fixed', top: '20px', left: '20px', width: '100px', height: '100px' }}>
        <ThreeDPill rotation={0} />
      </div>
      <div style={{ paddingTop: '150vh', textAlign: 'center' }}>
        <h1>Scroll down to see the pill react to scrolling</h1>
      </div>
    </div>
  );
}