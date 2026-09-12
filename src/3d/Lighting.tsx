import React from 'react';
import { BoardThemeId } from '../types/chess';

interface LightingProps {
  theme: BoardThemeId;
  shadows: boolean;
}

export const Lighting: React.FC<LightingProps> = ({ theme, shadows }) => {
  // Theme-specific light colors
  let keyColor = '#ffffff';
  let ambientColor = '#f0f4f8';
  let ambientIntensity = 0.55;
  let rimColor = '#94a3b8';

  switch (theme) {
    case 'cyber':
      keyColor = '#e0f2fe';
      ambientColor = '#0f172a';
      ambientIntensity = 0.65;
      rimColor = '#06b6d4';
      break;
    case 'midnight':
      keyColor = '#e2e8f0';
      ambientColor = '#1e1b4b';
      ambientIntensity = 0.5;
      rimColor = '#818cf8';
      break;
    case 'royal':
      keyColor = '#fef08a';
      ambientColor = '#1e3a8a';
      ambientIntensity = 0.6;
      rimColor = '#38bdf8';
      break;
    case 'wood':
      keyColor = '#fef3c7';
      ambientColor = '#451a03';
      ambientIntensity = 0.6;
      rimColor = '#f59e0b';
      break;
    case 'marble':
      keyColor = '#ffffff';
      ambientColor = '#f8fafc';
      ambientIntensity = 0.65;
      rimColor = '#cbd5e1';
      break;
    case 'classic':
    default:
      keyColor = '#fffbeb';
      ambientColor = '#27272a';
      ambientIntensity = 0.6;
      rimColor = '#d4d4d8';
      break;
  }

  return (
    <>
      {/* Soft Ambient Light */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Primary Key Light (casts shadows) */}
      <directionalLight
        position={[6, 12, 7]}
        intensity={1.4}
        color={keyColor}
        castShadow={shadows}
        shadow-mapSize-width={shadows ? 2048 : 512}
        shadow-mapSize-height={shadows ? 2048 : 512}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0003}
      />

      {/* Secondary Fill / Rim Light */}
      <directionalLight
        position={[-6, 8, -6]}
        intensity={0.7}
        color={rimColor}
      />

      {/* Subtle Overhead Soft Spotlight */}
      <pointLight position={[0, 9, 0]} intensity={0.4} color="#ffffff" distance={20} />

      {/* Corner Accent Point Lights */}
      <pointLight position={[-4, 2, -4]} intensity={0.2} color={rimColor} distance={10} />
      <pointLight position={[4, 2, 4]} intensity={0.2} color={keyColor} distance={10} />
    </>
  );
};
