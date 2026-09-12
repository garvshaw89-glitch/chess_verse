import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BoardThemeId, PieceThemeId, PieceType } from '../types/chess';
import { Piece3D } from './Piece3D';
import { getBoardColors } from './Board3D';

interface ThemePreview3DProps {
  boardTheme: BoardThemeId;
  pieceTheme: PieceThemeId;
  focusedPiece?: PieceType | 'all';
  autoRotate?: boolean;
}

// 3D Inner Showcase Scene
const ShowcaseScene: React.FC<ThemePreview3DProps> = ({
  boardTheme,
  pieceTheme,
  focusedPiece = 'all',
  autoRotate = true
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const colors = getBoardColors(boardTheme);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.28;
    }
  });

  // Showcase pieces definition on a 4x4 miniature grid
  // Grid coordinates: x in [-1.5, -0.5, 0.5, 1.5], z in [-1.5, -0.5, 0.5, 1.5]
  const allShowcasePieces = [
    { type: 'k' as PieceType, color: 'w' as const, pos: [-0.5, 0, 0.5] as [number, number, number], label: 'White King' },
    { type: 'q' as PieceType, color: 'b' as const, pos: [0.5, 0, -0.5] as [number, number, number], label: 'Black Queen' },
    { type: 'n' as PieceType, color: 'w' as const, pos: [1.5, 0, 0.5] as [number, number, number], label: 'White Knight' },
    { type: 'r' as PieceType, color: 'b' as const, pos: [-1.5, 0, -0.5] as [number, number, number], label: 'Black Rook' },
    { type: 'p' as PieceType, color: 'w' as const, pos: [-0.5, 0, 1.5] as [number, number, number], label: 'White Pawn' },
    { type: 'b' as PieceType, color: 'b' as const, pos: [0.5, 0, 1.5] as [number, number, number], label: 'Black Bishop' },
  ];

  const piecesToRender = focusedPiece === 'all'
    ? allShowcasePieces
    : [
        { type: focusedPiece, color: 'w' as const, pos: [-0.7, 0, 0] as [number, number, number], label: `White ${focusedPiece.toUpperCase()}` },
        { type: focusedPiece, color: 'b' as const, pos: [0.7, 0, 0] as [number, number, number], label: `Black ${focusedPiece.toUpperCase()}` }
      ];

  return (
    <group ref={groupRef}>
      {/* 4x4 Mini Board Stage */}
      <group position={[0, -0.1, 0]}>
        {/* Outer Frame Border */}
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <boxGeometry args={[4.4, 0.24, 4.4]} />
          <meshStandardMaterial
            color={colors.border}
            roughness={0.35}
            metalness={0.3}
          />
        </mesh>

        {/* Accent Inlay Rim */}
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[4.16, 0.02, 4.16]} />
          <meshStandardMaterial
            color={colors.accent}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>

        {/* 4x4 Tiles */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, xi) =>
          [-1.5, -0.5, 0.5, 1.5].map((z, zi) => {
            const isLight = (xi + zi) % 2 === 0;
            const tileColor = isLight ? colors.light : colors.dark;
            return (
              <mesh
                key={`tile_${x}_${z}`}
                position={[x, 0.02, z]}
                receiveShadow
              >
                <boxGeometry args={[0.98, 0.04, 0.98]} />
                <meshStandardMaterial
                  color={tileColor}
                  roughness={boardTheme === 'marble' ? 0.15 : 0.35}
                  metalness={boardTheme === 'cyber' ? 0.5 : 0.08}
                />
              </mesh>
            );
          })
        )}
      </group>

      {/* Showcase 3D Pieces */}
      {piecesToRender.map((p, idx) => (
        <group key={`${p.type}_${p.color}_${idx}`} position={p.pos}>
          <Piece3D
            type={p.type}
            color={p.color}
            theme={pieceTheme}
          />
        </group>
      ))}

      {/* Ground Soft Pedestal & Shadow Disc */}
      <mesh position={[0, -0.26, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.1, 48]} />
        <meshStandardMaterial color="#090a0f" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
};

export const ThemePreview3D: React.FC<ThemePreview3DProps> = ({
  boardTheme,
  pieceTheme,
  focusedPiece = 'all',
  autoRotate = true
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [3.8, 3.2, 4.2], fov: 38 }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0c0d12']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.65} />
        
        {/* Main Sun / Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />

        {/* Fill Cool Light */}
        <directionalLight
          position={[-5, 4, -4]}
          intensity={0.6}
          color="#90b8f8"
        />

        {/* Rim Light for dramatic edge speculars on pieces */}
        <pointLight
          position={[0, 4, -4]}
          intensity={1.2}
          color="#ffd166"
          distance={15}
        />

        {/* Orbit Controls with gentle clamping */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3.0}
          maxDistance={7.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          dampingFactor={0.08}
        />

        {/* Active Scene */}
        <ShowcaseScene
          boardTheme={boardTheme}
          pieceTheme={pieceTheme}
          focusedPiece={focusedPiece}
          autoRotate={autoRotate}
        />
      </Canvas>

      {/* Interactive Drag Hint Overlay */}
      <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] font-mono text-neutral-400/80 bg-neutral-950/60 px-2 py-0.5 rounded border border-neutral-800/60 backdrop-blur-xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};
