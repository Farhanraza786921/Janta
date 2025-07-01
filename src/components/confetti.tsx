'use client';

import React, { useEffect, useState, useMemo } from 'react';

interface Particle {
  id: number;
  style: React.CSSProperties;
  element: JSX.Element;
}

const colors = ['#D4A770', '#A67B5B', '#F2EBD3', '#FFFFFF'];

interface ConfettiProps {
  onComplete: () => void;
  particleCount?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ onComplete, particleCount = 150 }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const x = Math.random() * 100; // vw
      const y = Math.random() * 100 + 100; // start below screen (vh)
      const animDelay = `${Math.random() * 2}s`;
      const animDuration = `${Math.random() * 3 + 2}s`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4; // px

      const style: React.CSSProperties = {
        position: 'fixed',
        left: `${x}vw`,
        top: `${y}vh`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity: 0,
        zIndex: 1000,
        animation: `fall ${animDuration} ${animDelay} linear forwards`,
      };

      const shape = Math.random();
      let element: JSX.Element;
      if (shape < 0.5) {
        element = <div style={{ ...style, borderRadius: '50%' }} />;
      } else {
        element = <div style={style} />;
      }
      
      return { id: i, style, element };
    });

    setParticles(newParticles);
    
    const timer = setTimeout(onComplete, 5000); // Cleanup after 5 seconds

    return () => clearTimeout(timer);
  }, [onComplete, particleCount]);
  
  const keyframes = `
    @keyframes fall {
      to {
        transform: translateY(-200vh) rotateZ(720deg);
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        {particles.map(p => React.cloneElement(p.element, { key: p.id }))}
      </div>
    </>
  );
};

export default Confetti;
