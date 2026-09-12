import React from 'react';
import { prefersReducedMotion } from '../../config/animationConfig';

interface PieceTransitionProps {
  isVisible?: boolean;
  delayMs?: number;
  direction?: 'rise' | 'fall' | 'scale';
  children: React.ReactNode;
}

/**
 * PieceTransition:
 * Handles 3D piece entrance transitions and staggering effects.
 * Gives chess pieces tactile physical weight during layout entrance.
 */
export const PieceTransition: React.FC<PieceTransitionProps> = ({
  isVisible = true,
  delayMs = 0,
  direction = 'rise',
  children
}) => {
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    return <div style={{ opacity: isVisible ? 1 : 0 }}>{children}</div>;
  }

  const getTransform = () => {
    if (!isVisible) {
      if (direction === 'rise') return 'translate3d(0, 40px, -60px) scale(0.9)';
      if (direction === 'fall') return 'translate3d(0, -40px, -60px) scale(0.9)';
      return 'scale(0.85) translate3d(0, 0, -40px)';
    }
    return 'translate3d(0, 0, 0) scale(1)';
  };

  return (
    <div
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `transform 420ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity 350ms ease ${delayMs}ms`,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};
