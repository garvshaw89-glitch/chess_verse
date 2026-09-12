import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PieceType, PieceColor, PieceThemeId } from '../types/chess';
import { Piece3D } from './Piece3D';
import { squareToCoords } from './Board3D';

interface AnimatedPieceProps {
  id: string;
  type: PieceType;
  color: PieceColor;
  square: string;
  theme: PieceThemeId;
  isSelected: boolean;
  isUnderCheck: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const AnimatedPiece: React.FC<AnimatedPieceProps> = ({
  type,
  color,
  square,
  theme,
  isSelected,
  isUnderCheck,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [targetX, , targetZ] = squareToCoords(square);

  const prevCoords = useRef<[number, number]>([targetX, targetZ]);
  const isMoving = useRef<boolean>(false);
  const moveProgress = useRef<number>(1);

  useEffect(() => {
    if (prevCoords.current[0] !== targetX || prevCoords.current[1] !== targetZ) {
      if (groupRef.current) {
        prevCoords.current = [groupRef.current.position.x, groupRef.current.position.z];
      }
      isMoving.current = true;
      moveProgress.current = 0;
    }
  }, [targetX, targetZ]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isMoving.current) {
      moveProgress.current = Math.min(1, moveProgress.current + delta * 3.6);
      const t = moveProgress.current;

      // Smooth step
      const ease = t * t * (3 - 2 * t);
      const currentX = THREE.MathUtils.lerp(prevCoords.current[0], targetX, ease);
      const currentZ = THREE.MathUtils.lerp(prevCoords.current[1], targetZ, ease);

      // Parabolic arc lift during transit: lift -> move -> settle
      const arcHeight = Math.sin(t * Math.PI) * 0.85;
      const targetY = (isSelected ? 0.42 : 0) + arcHeight;

      groupRef.current.position.set(currentX, targetY, currentZ);

      // Dynamic physical tilt in travel direction during flight
      const dx = targetX - prevCoords.current[0];
      const dz = targetZ - prevCoords.current[1];
      const tiltMagnitude = Math.sin(t * Math.PI) * 0.12;
      groupRef.current.rotation.z = -dx * tiltMagnitude;
      groupRef.current.rotation.x = dz * tiltMagnitude;

      if (t >= 1) {
        isMoving.current = false;
        prevCoords.current = [targetX, targetZ];
        groupRef.current.rotation.set(0, 0, 0);
      }
    } else {
      // Resting position with lift and subtle breathing bob on selection
      const bob = isSelected ? Math.sin(performance.now() * 0.005) * 0.04 : 0;
      const targetY = isSelected ? 0.42 + bob : isHovered ? 0.12 : 0;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);

      // Smoothly return rotation to zero
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.2);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.2);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[targetX, isSelected ? 0.42 : 0, targetZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut();
      }}
    >
      <Piece3D
        type={type}
        color={color}
        theme={theme}
        isSelected={isSelected}
        isHovered={isHovered}
        isUnderCheck={isUnderCheck}
      />
    </group>
  );
};
