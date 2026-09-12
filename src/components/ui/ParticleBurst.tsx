import React, { useEffect, useState } from 'react';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
}

interface ParticleBurstProps {
  x: number;
  y: number;
  color?: string;
  onComplete?: () => void;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  x,
  y,
  color = '#f59e0b',
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>(() => {
    const arr: Particle[] = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 3.5 + 2.0;
      arr.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 2,
        color,
        opacity: 0.9,
        rotation: Math.random() * 360
      });
    }
    return arr;
  });

  useEffect(() => {
    let frameId: number;
    let startTime = performance.now();
    const duration = 400; // ms

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (progress >= 1) {
        if (onComplete) onComplete();
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy + 0.3, // slight gravity
          opacity: 0.9 * (1 - progress),
          rotation: p.rotation + 5
        }))
      );

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 8px ${p.color}`,
            transition: 'none'
          }}
        />
      ))}
    </div>
  );
};
