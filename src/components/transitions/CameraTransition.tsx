import React, { useEffect, useRef } from 'react';
import { CameraPreset } from '../../types/chess';
import { useGameStore } from '../../store/gameStore';
import { ANIMATION_CONFIG, prefersReducedMotion } from '../../config/animationConfig';

interface CameraTransitionProps {
  targetPreset: CameraPreset;
  durationMs?: number;
  onComplete?: () => void;
  children?: React.ReactNode;
}

/**
 * CameraTransition:
 * Orchestrates smooth camera motion between 3D perspectives.
 * Syncs seamlessly with the 3D canvas and navigation transitions.
 */
export const CameraTransition: React.FC<CameraTransitionProps> = ({
  targetPreset,
  durationMs = ANIMATION_CONFIG.pageTransition.totalDurationMs,
  onComplete,
  children
}) => {
  const setCameraPreset = useGameStore((state) => state.setCameraPreset);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    setCameraPreset(targetPreset);

    if (reducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    timerRef.current = setTimeout(() => {
      if (onComplete) onComplete();
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [targetPreset, durationMs, onComplete, setCameraPreset]);

  return <>{children}</>;
};
