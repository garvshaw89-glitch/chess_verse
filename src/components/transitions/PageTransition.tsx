import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { prefersReducedMotion } from '../../config/animationConfig';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { isTransitioning, transitionPhase, isNavigatingBack } = useNavigationStore();
  const reducedMotion = prefersReducedMotion();

  // Compute 3D perspective styling based on active transition phase
  const getPhaseStyles = (): React.CSSProperties => {
    if (reducedMotion) {
      return {
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 180ms ease-in-out'
      };
    }

    switch (transitionPhase) {
      case 'exit':
        return {
          transform: isNavigatingBack
            ? 'perspective(1200px) translate3d(0, 20px, -140px) scale(0.94)'
            : 'perspective(1200px) translate3d(0, -15px, -130px) scale(0.95)',
          opacity: 0.25,
          filter: 'blur(3px)',
          transition: 'transform 260ms cubic-bezier(0.2, 0, 0.2, 1), opacity 240ms ease, filter 240ms ease'
        };

      case 'curtain':
        return {
          transform: 'perspective(1200px) translate3d(0, 0, -100px) scale(0.94)',
          opacity: 0,
          visibility: 'hidden',
          transition: 'none'
        };

      case 'enter':
        return {
          transform: 'perspective(1200px) translate3d(0, 0, 0) scale(1)',
          opacity: 1,
          filter: 'blur(0px)',
          transition: 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease, filter 320ms ease'
        };

      case 'idle':
      default:
        return {
          transform: 'perspective(1200px) translate3d(0, 0, 0) scale(1)',
          opacity: 1,
          filter: 'blur(0px)',
          transition: 'none'
        };
    }
  };

  return (
    <div 
      className="relative w-full h-full flex-1 flex flex-col overflow-hidden will-change-transform"
      style={{
        transformStyle: 'preserve-3d',
        ...getPhaseStyles()
      }}
    >
      {children}
    </div>
  );
};
