import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
}

export const AmbientParticles: React.FC<ParticlesProps> = ({ count = 60 }) => {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 8 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = Math.random() * 0.004 + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocities[i * 3];
      array[i * 3 + 1] += velocities[i * 3 + 1];
      array[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around
      if (array[i * 3 + 1] > 9) array[i * 3 + 1] = 0.5;
      if (Math.abs(array[i * 3]) > 12) array[i * 3] *= -0.9;
      if (Math.abs(array[i * 3 + 2]) > 12) array[i * 3 + 2] *= -0.9;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#fbbf24"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
