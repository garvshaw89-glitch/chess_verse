import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BoardThemeId } from '../types/chess';

interface Board3DProps {
  theme: BoardThemeId;
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  checkSquare: string | null;
  hoveredSquare: string | null;
  onSquareClick: (sq: string) => void;
  onSquareHover: (sq: string | null) => void;
}

// Convert chess square "e4" to 3D coordinates [x, y, z]
export function squareToCoords(square: string): [number, number, number] {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1], 10) - 1; // 1=0, 8=7
  const x = file - 3.5;
  const z = 3.5 - rank;
  return [x, 0, z];
}

// Convert 3D coordinates back to square
export function coordsToSquare(x: number, z: number): string {
  const file = String.fromCharCode(97 + Math.round(x + 3.5));
  const rank = Math.round(3.5 - z) + 1;
  return `${file}${rank}`;
}

export function getBoardColors(theme: BoardThemeId) {
  switch (theme) {
    case 'midnight':
      return {
        light: '#2d3748',
        dark: '#171923',
        border: '#0f1117',
        accent: '#63b3ed'
      };
    case 'royal':
      return {
        light: '#e2e8f0',
        dark: '#1e3a8a',
        border: '#0f172a',
        accent: '#eab308'
      };
    case 'marble':
      return {
        light: '#f1f5f9',
        dark: '#334155',
        border: '#1e293b',
        accent: '#94a3b8'
      };
    case 'wood':
      return {
        light: '#e9d5a1',
        dark: '#8b5a2b',
        border: '#4a2c0f',
        accent: '#d97706'
      };
    case 'cyber':
      return {
        light: '#1e293b',
        dark: '#090d16',
        border: '#030712',
        accent: '#06b6d4'
      };
    case 'classic':
    default:
      return {
        light: '#eedbb0',
        dark: '#936a46',
        border: '#2e1c0c',
        accent: '#f59e0b'
      };
  }
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const Board3D: React.FC<Board3DProps> = ({
  theme,
  selectedSquare,
  legalMoves,
  lastMove,
  checkSquare,
  hoveredSquare,
  onSquareClick,
  onSquareHover
}) => {
  const colors = useMemo(() => getBoardColors(theme), [theme]);

  // Generate 64 squares
  const squares = useMemo(() => {
    const list = [];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sq = `${FILES[f]}${r + 1}`;
        const isLight = (f + r) % 2 !== 0;
        const [x, , z] = squareToCoords(sq);
        list.push({ sq, isLight, x, z });
      }
    }
    return list;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Wooden/Metallic Frame with Beveled Edge */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <boxGeometry args={[9.2, 0.4, 9.2]} />
        <meshPhysicalMaterial
          color={colors.border}
          roughness={0.4}
          metalness={0.2}
          clearcoat={0.3}
        />
      </mesh>

      {/* Inner Raised Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.12, 8.4]} />
        <meshPhysicalMaterial
          color={colors.border}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* 64 Chess Squares */}
      {squares.map(({ sq, isLight, x, z }) => {
        const isSelected = selectedSquare === sq;
        const isLegal = legalMoves.includes(sq);
        const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq);
        const isCheck = checkSquare === sq;
        const isHovered = hoveredSquare === sq;

        // Base square color
        const baseColor = isLight ? colors.light : colors.dark;

        return (
          <group key={sq} position={[x, 0, z]}>
            {/* Main square tile */}
            <mesh
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                onSquareClick(sq);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                onSquareHover(sq);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                onSquareHover(null);
              }}
            >
              <boxGeometry args={[0.96, 0.08, 0.96]} />
              <meshPhysicalMaterial
                color={baseColor}
                roughness={theme === 'marble' ? 0.15 : 0.35}
                metalness={theme === 'cyber' ? 0.4 : 0.05}
                clearcoat={0.2}
                emissive={
                  isCheck
                    ? '#ef4444'
                    : isSelected
                    ? colors.accent
                    : isLastMove
                    ? '#3b82f6'
                    : isHovered
                    ? '#ffffff'
                    : '#000000'
                }
                emissiveIntensity={
                  isCheck ? 0.6 : isSelected ? 0.35 : isLastMove ? 0.2 : isHovered ? 0.1 : 0
                }
              />
            </mesh>

            {/* Legal move indicator disc */}
            {isLegal && (
              <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.12, 0.24, 24]} />
                <meshBasicMaterial
                  color={colors.accent}
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Selected square border glow */}
            {isSelected && (
              <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.42, 0.47, 24]} />
                <meshBasicMaterial
                  color="#f59e0b"
                  transparent
                  opacity={0.9}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Check King Red Glow Alert */}
            {isCheck && (
              <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.35, 0.46, 24]} />
                <meshBasicMaterial
                  color="#ef4444"
                  transparent
                  opacity={0.85}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Subtle Coordinate Marks on Border (Files a-h & Ranks 1-8) */}
      {FILES.map((file, i) => (
        <group key={`file-${file}`}>
          {/* Bottom border rank 1 */}
          <mesh position={[i - 3.5, 0.02, 4.35]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshBasicMaterial color="#71717a" transparent opacity={0.6} />
          </mesh>
          {/* Top border rank 8 */}
          <mesh position={[i - 3.5, 0.02, -4.35]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshBasicMaterial color="#71717a" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {RANKS.map((rank, i) => (
        <group key={`rank-${rank}`}>
          {/* Left border file a */}
          <mesh position={[-4.35, 0.02, 3.5 - i]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshBasicMaterial color="#71717a" transparent opacity={0.6} />
          </mesh>
          {/* Right border file h */}
          <mesh position={[4.35, 0.02, 3.5 - i]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshBasicMaterial color="#71717a" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
