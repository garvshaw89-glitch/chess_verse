import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Square } from 'chess.js';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { useDevice, resolveEffectiveTier } from '../services/deviceTier';
import { Board3D } from './Board3D';
import { AnimatedPiece } from './AnimatedPiece';
import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { AmbientParticles } from './Particles';
import { WebGLFallback } from '../components/ui/WebGLFallback';
import { PieceType, PieceColor } from '../types/chess';

interface ChessCanvasProps {
  interactive?: boolean;
  isHeroPreview?: boolean;
}

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const ChessCanvas: React.FC<ChessCanvasProps> = ({
  interactive = true,
  isHeroPreview = false
}) => {
  const [webglAvailable] = useState<boolean>(() => checkWebGL());
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  const {
    chess,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck,
    turn,
    cameraPreset,
    selectSquare,
    makeMove,
    viewingMoveIndex,
    history
  } = useGameStore();

  const { gameplay, graphics } = useSettingsStore();
  const device = useDevice();
  const effectiveTier = resolveEffectiveTier(graphics.quality, device.detectedTier);

  // Compute adaptive DPR based on effective quality tier
  const dpr = useMemo<[number, number]>(() => {
    if (effectiveTier === 'low') return [1, 1];
    if (effectiveTier === 'medium') return [1, Math.min(1.5, device.dpr)];
    return [1, Math.min(2, device.dpr)];
  }, [effectiveTier, device.dpr]);

  // Compute particle count based on tier
  const particleCount = useMemo(() => {
    if (!graphics.particles || effectiveTier === 'low') return 0;
    if (effectiveTier === 'medium') return isHeroPreview ? 40 : 25;
    return isHeroPreview ? 90 : 50;
  }, [graphics.particles, effectiveTier, isHeroPreview]);

  // If user requested 2D mode in settings or WebGL unavailable, render 2D fallback
  if (!webglAvailable || graphics.viewMode === '2d') {
    return <WebGLFallback />;
  }

  // Hero preview animated opening moves cycle
  const [heroFenIndex, setHeroFenIndex] = useState(0);
  const heroFens = useMemo(() => [
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
    'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'
  ], []);

  useEffect(() => {
    if (!isHeroPreview) return;
    const interval = setInterval(() => {
      setHeroFenIndex((prev) => (prev + 1) % heroFens.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHeroPreview, heroFens.length]);

  // Determine which position to display (live vs history rewind vs hero preview)
  const displayFen = useMemo(() => {
    if (isHeroPreview) {
      return heroFens[heroFenIndex];
    }
    if (viewingMoveIndex >= 0 && viewingMoveIndex < history.length) {
      return history[viewingMoveIndex].fen;
    }
    return chess.fen();
  }, [isHeroPreview, heroFens, heroFenIndex, viewingMoveIndex, history, chess]);

  // Persistent identity map to keep <AnimatedPiece> instances mounted between moves
  const pieceIdentitiesRef = React.useRef<Map<string, { id: string; type: PieceType; color: PieceColor }>>(new Map());

  // Extract all pieces on the board with stable identity preservation
  const boardPieces = useMemo(() => {
    const rawPieces: { type: PieceType; color: PieceColor; square: string }[] = [];
    const rows = displayFen.split(' ')[0].split('/');

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

          rawPieces.push({
            type,
            color,
            square
          });
          fileIdx++;
        }
      }
    });

    const prevMap = pieceIdentitiesRef.current;
    const nextMap = new Map<string, { id: string; type: PieceType; color: PieceColor }>();
    const assignedIds = new Set<string>();

    // 1. Handle lastMove (source piece moves to target square)
    if (lastMove) {
      const prevPiece = prevMap.get(lastMove.from);
      const newPiece = rawPieces.find((p) => p.square === lastMove.to);
      if (prevPiece && newPiece && prevPiece.color === newPiece.color) {
        nextMap.set(lastMove.to, { id: prevPiece.id, type: newPiece.type, color: newPiece.color });
        assignedIds.add(prevPiece.id);

        // Check for castling companion rook move
        if (prevPiece.type === 'k') {
          if (lastMove.from === 'e1' && lastMove.to === 'g1') {
            const rook = prevMap.get('h1');
            if (rook) {
              nextMap.set('f1', { id: rook.id, type: 'r', color: 'w' });
              assignedIds.add(rook.id);
            }
          } else if (lastMove.from === 'e1' && lastMove.to === 'c1') {
            const rook = prevMap.get('a1');
            if (rook) {
              nextMap.set('d1', { id: rook.id, type: 'r', color: 'w' });
              assignedIds.add(rook.id);
            }
          } else if (lastMove.from === 'e8' && lastMove.to === 'g8') {
            const rook = prevMap.get('h8');
            if (rook) {
              nextMap.set('f8', { id: rook.id, type: 'r', color: 'b' });
              assignedIds.add(rook.id);
            }
          } else if (lastMove.from === 'e8' && lastMove.to === 'c8') {
            const rook = prevMap.get('a8');
            if (rook) {
              nextMap.set('d8', { id: rook.id, type: 'r', color: 'b' });
              assignedIds.add(rook.id);
            }
          }
        }
      }
    }

    // 2. Preserve IDs for all stationary pieces
    rawPieces.forEach((p) => {
      if (nextMap.has(p.square)) return;
      const prev = prevMap.get(p.square);
      if (prev && prev.color === p.color && prev.type === p.type && !assignedIds.has(prev.id)) {
        nextMap.set(p.square, { id: prev.id, type: p.type, color: p.color });
        assignedIds.add(prev.id);
      }
    });

    // 3. Assign IDs to any remaining pieces (newly introduced, promoted, or initial load)
    const result = rawPieces.map((p) => {
      let entry = nextMap.get(p.square);
      if (!entry) {
        const id = `${p.color}_${p.type}_${p.square}_${Math.random().toString(36).substring(2, 8)}`;
        entry = { id, type: p.type, color: p.color };
        nextMap.set(p.square, entry);
      }
      return {
        id: entry.id,
        type: p.type,
        color: p.color,
        square: p.square
      };
    });

    pieceIdentitiesRef.current = nextMap;
    return result;
  }, [displayFen, lastMove]);

  // Find King square if in check
  const checkSquare = useMemo(() => {
    if (!isCheck) return null;
    const kingPiece = boardPieces.find((p) => p.type === 'k' && p.color === turn);
    return kingPiece ? kingPiece.square : null;
  }, [isCheck, boardPieces, turn]);

  // Square interaction handler
  const handleSquareClick = (sq: string) => {
    if (!interactive) return;

    if (selectedSquare) {
      if (legalMoves.includes(sq)) {
        makeMove(selectedSquare, sq);
      } else {
        selectSquare(sq);
      }
    } else {
      selectSquare(sq);
    }
  };

  // Piece click handler
  const handlePieceClick = (pieceSquare: string, pieceColor: PieceColor) => {
    if (!interactive) return;

    // If we have a selected piece and clicked an opponent piece that is a legal capture
    if (selectedSquare && legalMoves.includes(pieceSquare)) {
      makeMove(selectedSquare, pieceSquare);
      return;
    }

    // Otherwise select this piece if it belongs to active player
    if (pieceColor === turn) {
      selectSquare(pieceSquare);
    } else {
      selectSquare(null);
    }
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
          position: isHeroPreview ? [7.5, 5.5, 8.5] : [0, 8.2, 9.2],
          fov: 44,
          near: 0.1,
          far: 60
        }}
      >
        <Suspense fallback={null}>
          <Lighting theme={gameplay.boardTheme} shadows={graphics.shadows && effectiveTier !== 'low'} />

          <CameraController
            preset={isHeroPreview ? 'cinematic' : cameraPreset}
            isCinematicActive={isHeroPreview}
          />

          <Board3D
            theme={gameplay.boardTheme}
            selectedSquare={selectedSquare}
            legalMoves={gameplay.showLegalMoves ? legalMoves : []}
            lastMove={lastMove}
            checkSquare={checkSquare}
            hoveredSquare={hoveredSquare}
            onSquareClick={handleSquareClick}
            onSquareHover={setHoveredSquare}
          />

          {boardPieces.map((p) => (
            <AnimatedPiece
              key={p.id}
              id={p.id}
              type={p.type}
              color={p.color}
              square={p.square}
              theme={gameplay.pieceTheme}
              isSelected={selectedSquare === p.square}
              isUnderCheck={checkSquare === p.square}
              isHovered={hoveredSquare === p.square}
              onClick={() => handlePieceClick(p.square, p.color)}
              onPointerOver={() => setHoveredSquare(p.square)}
              onPointerOut={() => setHoveredSquare(null)}
            />
          ))}

          {particleCount > 0 && <AmbientParticles count={particleCount} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
