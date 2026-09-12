import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PieceType, PieceColor, PieceThemeId } from '../types/chess';

interface Piece3DProps {
  type: PieceType;
  color: PieceColor;
  theme: PieceThemeId;
  isSelected?: boolean;
  isHovered?: boolean;
  isUnderCheck?: boolean;
  position?: [number, number, number];
}

// Material generators for different themes
function getPieceMaterials(color: PieceColor, theme: PieceThemeId, isSelected?: boolean, isUnderCheck?: boolean) {
  const isWhite = color === 'w';

  // Base colors
  let diffuseColor = isWhite ? '#f0eee9' : '#1e2024';
  let roughness = 0.25;
  let metalness = 0.1;
  let clearcoat = 0.3;
  let emissive = '#000000';
  let emissiveIntensity = 0;

  switch (theme) {
    case 'wood':
      diffuseColor = isWhite ? '#d7be99' : '#4a2f1b';
      roughness = 0.45;
      metalness = 0.05;
      clearcoat = 0.1;
      break;

    case 'marble':
      diffuseColor = isWhite ? '#fcfbf9' : '#121417';
      roughness = 0.12;
      metalness = 0.04;
      clearcoat = 0.85;
      break;

    case 'minimalist':
      diffuseColor = isWhite ? '#f3f4f6' : '#18181b';
      roughness = 0.22;
      metalness = 0.08;
      clearcoat = 0.55;
      break;

    case 'metal':
      diffuseColor = isWhite ? '#e8edf2' : '#2d333b';
      roughness = 0.2;
      metalness = 0.85;
      clearcoat = 0.4;
      break;

    case 'futuristic':
      diffuseColor = isWhite ? '#00e5ff' : '#ff0055';
      roughness = 0.1;
      metalness = 0.7;
      clearcoat = 0.8;
      emissive = isWhite ? '#00b4d8' : '#d90429';
      emissiveIntensity = 0.25;
      break;

    case 'classic':
    default:
      diffuseColor = isWhite ? '#ede9de' : '#18191c';
      roughness = 0.28;
      metalness = 0.12;
      clearcoat = 0.4;
      break;
  }

  if (isSelected) {
    emissive = '#f59e0b'; // amber glow on select
    emissiveIntensity = 0.45;
  } else if (isUnderCheck) {
    emissive = '#ef4444'; // red pulse on check
    emissiveIntensity = 0.6;
  }

  return {
    color: diffuseColor,
    roughness,
    metalness,
    clearcoat,
    emissive,
    emissiveIntensity
  };
}

export const Piece3D: React.FC<Piece3DProps> = ({
  type,
  color,
  theme,
  isSelected,
  isHovered,
  isUnderCheck
}) => {
  const matProps = useMemo(
    () => getPieceMaterials(color, theme, isSelected, isUnderCheck),
    [color, theme, isSelected, isUnderCheck]
  );

  // High quality geometry groups per piece type
  switch (type) {
    case 'p': // PAWN
      if (theme === 'minimalist') {
        return (
          <group>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.35, 0.24, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.26, 0.44, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          {/* Base */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.38, 0.16, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Base Ring */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.32, 0.08, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Tapered Stem */}
          <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.24, 0.48, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Neck Collar */}
          <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.06, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Head Sphere */}
          <mesh position={[0, 0.94, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </group>
      );

    case 'r': // ROOK
      if (theme === 'minimalist') {
        return (
          <group>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.68, 0.24, 0.68]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.54, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.54, 0.6, 0.54]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.92, 0]} castShadow>
              <boxGeometry args={[0.62, 0.18, 0.62]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          {/* Base */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.2, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Tower Body */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.33, 0.7, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Rampart Base */}
          <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.28, 0.12, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Crenellations (Battlements) */}
          <mesh position={[0, 1.08, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.16, 24, 1, true]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </group>
      );

    case 'n': // KNIGHT
      if (theme === 'minimalist') {
        return (
          <group rotation={[0, color === 'w' ? 0 : Math.PI, 0]}>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.32, 0.38, 0.24, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.52, -0.04]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.32, 0.58, 0.42]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.86, 0.08]} rotation={[-0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.28, 0.32, 0.46]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          </group>
        );
      }
      return (
        <group rotation={[0, color === 'w' ? 0 : Math.PI, 0]}>
          {/* Base */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.2, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Neck curve */}
          <mesh position={[0, 0.46, -0.04]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.58, 0.34]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Horse Head / Muzzle */}
          <mesh position={[0, 0.78, 0.12]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.32, 0.44]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Snout */}
          <mesh position={[0, 0.68, 0.3]} rotation={[0.4, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.22, 0.24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.08, 1.02, 0.02]} rotation={[0.2, 0, -0.2]} castShadow>
            <coneGeometry args={[0.06, 0.18, 12]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh position={[0.08, 1.02, 0.02]} rotation={[0.2, 0, 0.2]} castShadow>
            <coneGeometry args={[0.06, 0.18, 12]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Mane */}
          <mesh position={[0, 0.65, -0.2]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.5, 0.12]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </group>
      );

    case 'b': // BISHOP
      if (theme === 'minimalist') {
        return (
          <group>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.32, 0.38, 0.24, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.28, 0.68, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 1.05, 0]} rotation={[0.35, 0, 0]} castShadow>
              <coneGeometry args={[0.22, 0.46, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          {/* Base */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.2, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Waist */}
          <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.27, 0.34, 0.08, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Body stem */}
          <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.26, 0.6, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Collar */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.2, 0.06, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Mitre (Head oval) */}
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Finial Cross/Ball */}
          <mesh position={[0, 1.42, 0]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </group>
      );

    case 'q': // QUEEN
      if (theme === 'minimalist') {
        return (
          <group>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.38, 0.44, 0.24, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.32, 0.88, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.24, 0.05, 16, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 1.25, 0]} castShadow>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          {/* Base */}
          <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.46, 0.22, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Waist ring */}
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.38, 0.08, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Hourglass Stem */}
          <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.29, 0.76, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Coronet Flare */}
          <mesh position={[0, 1.14, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.24, 0.2, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Crown Pearls / Coronet Petals */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * Math.PI * 2) / 8;
            const r = 0.34;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * r, 1.26, Math.sin(angle) * r]}
                castShadow
              >
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshPhysicalMaterial {...matProps} />
              </mesh>
            );
          })}
          {/* Central Queen Crown Orb */}
          <mesh position={[0, 1.34, 0]} castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </group>
      );

    case 'k': // KING
      if (theme === 'minimalist') {
        return (
          <group>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.4, 0.46, 0.24, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.25, 0.34, 1.0, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 1.3, 0]} castShadow>
              <cylinderGeometry args={[0.36, 0.26, 0.16, 32]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 1.48, 0]} castShadow>
              <boxGeometry args={[0.1, 0.22, 0.1]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[0.22, 0.08, 0.1]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          {/* Base */}
          <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.44, 0.48, 0.22, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.32, 0.85, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Imperial Crown Capital */}
          <mesh position={[0, 1.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.39, 0.26, 0.22, 28]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Top Cross vertical */}
          <mesh position={[0, 1.46, 0]} castShadow>
            <boxGeometry args={[0.08, 0.26, 0.08]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Top Cross horizontal bar */}
          <mesh position={[0, 1.48, 0]} castShadow>
            <boxGeometry args={[0.22, 0.08, 0.08]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </group>
      );
  }
};
