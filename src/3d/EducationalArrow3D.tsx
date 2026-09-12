import React, { useMemo } from 'react';
import * as THREE from 'three';
import { squareToCoords } from './Board3D';

interface EducationalArrow3DProps {
  from: string;
  to: string;
  color?: string;
}

export const EducationalArrow3D: React.FC<EducationalArrow3DProps> = ({
  from,
  to,
  color = '#10b981' // emerald green default
}) => {
  const [startCoords, endCoords, distance, angle, midX, midZ] = useMemo(() => {
    const [x1, , z1] = squareToCoords(from);
    const [x2, , z2] = squareToCoords(to);

    const dx = x2 - x1;
    const dz = z2 - z1;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const ang = Math.atan2(dx, dz);

    const mx = (x1 + x2) / 2;
    const mz = (z1 + z2) / 2;

    return [[x1, 0, z1], [x2, 0, z2], dist, ang, mx, mz];
  }, [from, to]);

  if (distance < 0.2) return null;

  const headLength = Math.min(0.5, distance * 0.35);
  const shaftLength = Math.max(0.1, distance - headLength);

  return (
    <group position={[midX, 0.16, midZ]} rotation={[0, angle, 0]}>
      {/* Shaft */}
      <mesh
        position={[0, 0, -headLength / 2]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.07, 0.07, shaftLength, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Arrowhead Cone */}
      <mesh
        position={[0, 0, distance / 2 - headLength / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[0.22, headLength, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Origin Ring */}
      <mesh position={[0, 0, -distance / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.04, 16, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};
