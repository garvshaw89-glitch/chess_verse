import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { ANIMATION_CONFIG, prefersReducedMotion } from '../../config/animationConfig';
import { Sparkles, Shield, Users, Target, GraduationCap, User, Flame } from 'lucide-react';

export const TransitionOverlay: React.FC = () => {
  const { isTransitioning, transitionPhase, targetPage } = useNavigationStore();

  if (!isTransitioning && transitionPhase === 'idle') return null;

  const reducedMotion = prefersReducedMotion();
  const theme = targetPage ? (ANIMATION_CONFIG.pageThemes as any)[targetPage] : null;

  // Icon mapping for high-tech HUD in transition
  const getContextIcon = () => {
    switch (targetPage) {
      case '2player':
        return <Users className="w-8 h-8 text-sky-400 animate-pulse" />;
      case 'puzzles':
        return <Target className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />;
      case 'learn':
        return <GraduationCap className="w-8 h-8 text-purple-400 animate-bounce" />;
      case 'profile':
        return <User className="w-8 h-8 text-amber-400" />;
      case 'play':
        return <Flame className="w-8 h-8 text-amber-500 animate-pulse" />;
      default:
        return <Shield className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-300 ${
        transitionPhase === 'curtain' ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backdropFilter: reducedMotion ? 'none' : 'blur(16px)',
        backgroundColor: 'rgba(5, 5, 5, 0.78)'
      }}
    >
      {/* Cinematic Golden Light Streak travelling horizontally */}
      {!reducedMotion && (
        <div 
          className="absolute inset-x-0 h-1 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden"
        >
          <div 
            className="w-full h-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
            style={{
              animation: 'streak 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              boxShadow: `0 0 30px ${theme?.accentColor || '#f59e0b'}`
            }}
          />
        </div>
      )}

      {/* Center 3D Floating Chess Hologram Banner */}
      <div 
        className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center max-w-sm mx-4 transform-gpu"
        style={{
          transform: transitionPhase === 'curtain' 
            ? 'scale(1) translateY(0) translateZ(0)' 
            : 'scale(0.85) translateY(20px) translateZ(-80px)',
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease',
          opacity: transitionPhase === 'curtain' ? 1 : 0
        }}
      >
        {/* Glow halo behind chess piece */}
        <div 
          className="absolute w-28 h-28 rounded-full blur-2xl -z-10 opacity-30 animate-pulse"
          style={{ backgroundColor: theme?.accentColor || '#f59e0b' }}
        />

        {/* 3D Chess Symbol with floating levitation */}
        <div className="relative mb-3 flex items-center justify-center">
          <span 
            className="text-6xl font-serif select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
            style={{
              color: theme?.accentColor || '#f59e0b',
              transform: 'perspective(600px) rotateX(8deg)',
              display: 'inline-block'
            }}
          >
            {theme?.symbol || '♔'}
          </span>
          <div className="absolute -bottom-2">
            {getContextIcon()}
          </div>
        </div>

        {/* Tactical Transition Title */}
        <div className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mt-2">
          {theme?.tagline || 'CHESSVERSE 3D'}
        </div>

        <div className="text-base font-display font-extrabold text-neutral-100 tracking-wide mt-1">
          {theme?.label || 'Preparing the battlefield...'}
        </div>

        {/* Minimalist Progress Meter */}
        <div className="w-36 h-1 bg-neutral-800 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              backgroundColor: theme?.accentColor || '#f59e0b',
              width: transitionPhase === 'curtain' ? '100%' : '20%',
              boxShadow: `0 0 10px ${theme?.accentColor || '#f59e0b'}`
            }}
          />
        </div>
      </div>
    </div>
  );
};
