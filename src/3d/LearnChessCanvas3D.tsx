import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLearnStore } from '../store/learnStore';
import { useSettingsStore } from '../store/settingsStore';
import { useDevice, resolveEffectiveTier } from '../services/deviceTier';
import { Board3D } from './Board3D';
import { AnimatedPiece } from './AnimatedPiece';
import { Lighting } from './Lighting';
import { AmbientParticles } from './Particles';
import { EducationalArrow3D } from './EducationalArrow3D';
import { EducationalSquareHighlight3D } from './EducationalSquareHighlight3D';
import { PieceType, PieceColor } from '../types/chess';
import { LearnCameraMode } from '../types/learn';

const CAMERA_POSITIONS: Record<LearnCameraMode, [number, number, number]> = {
  overview: [0, 9.2, 9.2],
  focus: [0, 6.2, 5.8],
  piece: [2.5, 5.0, 4.2],
  tactical: [0, 8.5, 7.8],
  top: [0, 13.8, 0.001],
  cinematic: [7.5, 5.5, 8.5]
};

const LearnCameraController: React.FC<{ mode: LearnCameraMode; focusSquare?: string | null }> = ({
  mode
}) => {
  const { camera, size } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(...CAMERA_POSITIONS[mode]));
  const lookAtTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const angleRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(true);

  // Compute adaptive distance scale for narrow portrait screens
  const aspect = size.width / Math.max(1, size.height);
  const portraitScale = aspect < 1.05 ? Math.min(1.65, 1.1 / Math.max(0.45, aspect)) : 1.0;

  useEffect(() => {
    const [baseX, baseY, baseZ] = CAMERA_POSITIONS[mode] || CAMERA_POSITIONS.tactical;
    if (mode === 'top') {
      targetPos.current.set(baseX, baseY * portraitScale, baseZ);
    } else {
      targetPos.current.set(
        baseX,
        baseY * portraitScale,
        baseZ * portraitScale
      );
    }
    isTransitioningRef.current = true;
  }, [mode, aspect, portraitScale]);

  useFrame((_, delta) => {
    if (mode === 'cinematic') {
      angleRef.current += delta * 0.12;
      const radius = 10.5 * portraitScale;
      const x = Math.sin(angleRef.current) * radius;
      const z = Math.cos(angleRef.current) * radius;
      camera.position.lerp(new THREE.Vector3(x, 7.2 * portraitScale, z), 0.04);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    } else if (isTransitioningRef.current) {
      camera.position.lerp(targetPos.current, 0.08);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookAtTarget.current, 0.08);
        controlsRef.current.update();
      }
      if (camera.position.distanceTo(targetPos.current) < 0.03) {
        camera.position.copy(targetPos.current);
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={3.5}
      maxDistance={25}
      rotateSpeed={0.75}
      zoomSpeed={0.85}
      panSpeed={0.65}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
      }}
      onStart={() => {
        isTransitioningRef.current = false;
      }}
    />
  );
};

export const LearnChessCanvas3D: React.FC = () => {
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  const {
    boardFen,
    selectedSquare,
    legalMoves,
    lastMove,
    cameraMode,
    activeArrow,
    highlightSquares,
    selectSquare,
    handlePlayerMove
  } = useLearnStore();

  const { gameplay, graphics } = useSettingsStore();
  const device = useDevice();
  const effectiveTier = resolveEffectiveTier(graphics.quality, device.detectedTier);

  const dpr = useMemo<[number, number]>(() => {
    if (effectiveTier === 'low') return [1, 1];
    if (effectiveTier === 'medium') return [1, Math.min(1.5, device.dpr)];
    return [1, Math.min(2, device.dpr)];
  }, [effectiveTier, device.dpr]);

  const particleCount = useMemo(() => {
    if (!graphics.particles || effectiveTier === 'low') return 0;
    if (effectiveTier === 'medium') return 20;
    return 40;
  }, [graphics.particles, effectiveTier]);

  // Extract piece objects from FEN
  const boardPieces = useMemo(() => {
    const raw: { id: string; type: PieceType; color: PieceColor; square: string }[] = [];
    const rows = boardFen.split(' ')[0].split('/');

    rows.forEach((rowStr, rIdx) => {
      const rank = 8 - rIdx;
      let fileIdx = 0;
      for (const char of rowStr) {
        if (/\d/.test(char)) {
          fileIdx += parseInt(char, 10);
        } else {
          const file = String.fromCharCode(97 + fileIdx);
          const square = `${file}${rank}`;
          const isWhite = char === char.toUpperCase();
          const type = char.toLowerCase() as PieceType;
          const color: PieceColor = isWhite ? 'w' : 'b';

          raw.push({
            id: `lp_${square}_${type}_${color}`,
            type,
            color,
            square
          });
          fileIdx++;
        }
      }
    });

    return raw;
  }, [boardFen]);

  const handleSquareClick = (sq: string) => {
    selectSquare(sq);
  };

  const handlePieceClick = (pieceSquare: string, pieceColor: PieceColor) => {
    if (selectedSquare && legalMoves.includes(pieceSquare)) {
      handlePlayerMove(selectedSquare, pieceSquare);
      return;
    }

    selectSquare(pieceSquare);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      <Canvas
        shadows={graphics.shadows && effectiveTier !== 'low'}
        dpr={dpr}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        gl={{
          antialias: effectiveTier !== 'low',
          powerPreference: effectiveTier === 'low' ? 'low-power' : 'high-performance',
          alpha: true
        }}
        camera={{
          position: CAMERA_POSITIONS[cameraMode] || CAMERA_POSITIONS.tactical,
          fov: 44,
          near: 0.1,
          far: 60
        }}
      >
        <Suspense fallback={null}>
          <Lighting theme={gameplay.boardTheme} shadows={graphics.shadows && effectiveTier !== 'low'} />

          <LearnCameraController mode={cameraMode} />

          <Board3D
            theme={gameplay.boardTheme}
            selectedSquare={selectedSquare}
            legalMoves={gameplay.showLegalMoves ? legalMoves : []}
            lastMove={lastMove}
            checkSquare={null}
            hoveredSquare={hoveredSquare}
            onSquareClick={handleSquareClick}
            onSquareHover={setHoveredSquare}
          />

          {/* Educational Highlights */}
          {highlightSquares.map((sq) => (
            <EducationalSquareHighlight3D key={sq} square={sq} color="#10b981" variant="focus" />
          ))}

          {/* Educational Arrows */}
          {activeArrow && (
            <EducationalArrow3D
              from={activeArrow.from}
              to={activeArrow.to}
              color={activeArrow.color || '#10b981'}
            />
          )}

          {/* 3D Chess Pieces */}
          {boardPieces.map((p) => (
            <AnimatedPiece
              key={p.id}
              id={p.id}
              type={p.type}
              color={p.color}
              square={p.square}
              theme={gameplay.pieceTheme}
              isSelected={selectedSquare === p.square}
              isUnderCheck={false}
              isHovered={hoveredSquare === p.square}
              onClick={() => handlePieceClick(p.square, p.color)}
              onPointerOver={() => setHoveredSquare(p.square)}
              onPointerOut={() => setHoveredSquare(null)}
            />
          ))}

          {graphics.particles && <AmbientParticles count={40} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
