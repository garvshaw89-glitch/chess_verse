import React, { useEffect, useState } from 'react';
import { prefersReducedMotion, ANIMATION_CONFIG } from '../../config/animationConfig';

interface Modal3DProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const Modal3D: React.FC<Modal3DProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-xl',
  className = ''
}) => {
  const [mounted, setMounted] = useState(isOpen);
  const [active, setActive] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small frame delay to trigger transition cleanly
      const t = requestAnimationFrame(() => {
        setActive(true);
      });
      return () => cancelAnimationFrame(t);
    } else {
      setActive(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, reducedMotion ? 50 : ANIMATION_CONFIG.modal.durationMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, reducedMotion]);

  if (!mounted) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{
        perspective: '1200px'
      }}
    >
      {/* 3D Backdrop Blur with deep perspective dimming */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 transition-all duration-300"
        style={{
          backdropFilter: active ? 'blur(12px)' : 'blur(0px)',
          opacity: active ? 1 : 0,
          transition: 'opacity 300ms ease, backdrop-filter 300ms ease'
        }}
      />

      {/* 3D Emergent Modal Shell */}
      <div
        style={{
          transform: active
            ? 'perspective(1200px) rotateX(0deg) translate3d(0, 0, 0) scale(1)'
            : `perspective(1200px) rotateX(${reducedMotion ? 0 : 5}deg) translate3d(0, 20px, ${reducedMotion ? 0 : -160}px) scale(${reducedMotion ? 0.98 : 0.92})`,
          opacity: active ? 1 : 0,
          transformStyle: 'preserve-3d',
          transition: reducedMotion
            ? 'opacity 180ms ease'
            : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease, box-shadow 320ms ease'
        }}
        className={`
          relative w-full ${maxWidth} bg-neutral-900/95 border border-neutral-700/80 
          rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.08)] 
          overflow-hidden flex flex-col z-10 will-change-transform
          ${className}
        `}
      >
        {/* Top ambient glow bar */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />
        
        {children}
      </div>
    </div>
  );
};
