import React from 'react';
import { squareToCoords } from './Board3D';

interface EducationalSquareHighlight3DProps {
  square: string;
  color?: string;
  variant?: 'target' | 'focus' | 'pulse';
}

export const EducationalSquareHighlight3D: React.FC<EducationalSquareHighlight3DProps> = ({
  square,
  color = '#38bdf8',
  variant = 'target'
}) => {
  const [x, , z] = squareToCoords(square);

  return (
    <group position={[x, 0.02, z]}>
      {/* Square Ground Decal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.92, 0.92]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={variant === 'focus' ? 0.35 : 0.22}
          depthWrite={false}
        />
      </mesh>

      {/* Perimeter Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.44, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
