import React, { useState, useRef } from 'react';
import { ParticleBurst } from './ParticleBurst';
import { soundService } from '../../services/sound';
import { ANIMATION_CONFIG, prefersReducedMotion } from '../../config/animationConfig';

export type Button3DVariant = 
  | 'primary'      // Rich gold/amber glowing AAA hero button
  | 'secondary'    // Obsidian slate with metallic subtle border
  | 'amber'        // Solid amber game action
  | 'cyan'         // Cybernetic AI / tech blue
  | 'purple'       // Royal Academy purple
  | 'emerald'      // Tactical puzzle green
  | 'ghost'        // Subtle transparent glass
  | 'danger';      // Resign / abort red

export type Button3DSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Button3DVariant;
  size?: Button3DSize;
  soundType?: 'primary' | 'secondary' | 'tactile' | 'none';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  particleColor?: string;
  enableParticles?: boolean;
  navTarget?: string;
  onPressAnimationEnd?: () => void;
  fullWidth?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  soundType = 'primary',
  icon,
  iconPosition = 'left',
  particleColor,
  enableParticles = true,
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [burstCoords, setBurstCoords] = useState<{ x: number; y: number } | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const isLockedRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Variant Styling Matrix
  const variantStyles: Record<Button3DVariant, { bg: string; border: string; text: string; shadow: string; glow: string }> = {
    primary: {
      bg: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300',
      border: 'border-amber-300/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      text: 'text-neutral-950 font-black tracking-wider uppercase',
      shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)]',
      glow: '#f59e0b'
    },
    secondary: {
      bg: 'bg-neutral-900/90 hover:bg-neutral-800/95',
      border: 'border-neutral-700/80 hover:border-amber-500/50',
      text: 'text-neutral-100 font-bold',
      shadow: 'shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]',
      glow: '#d4d4d8'
    },
    amber: {
      bg: 'bg-amber-500 hover:bg-amber-400',
      border: 'border-amber-400/80',
      text: 'text-neutral-950 font-extrabold',
      shadow: 'shadow-[0_6px_18px_rgba(245,158,11,0.3)]',
      glow: '#f59e0b'
    },
    cyan: {
      bg: 'bg-cyan-500/15 hover:bg-cyan-500/25',
      border: 'border-cyan-500/50 hover:border-cyan-400',
      text: 'text-cyan-300 font-bold',
      shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      glow: '#06b6d4'
    },
    purple: {
      bg: 'bg-purple-500/20 hover:bg-purple-500/30',
      border: 'border-purple-500/50 hover:border-purple-400',
      text: 'text-purple-300 font-bold',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]',
      glow: '#a855f7'
    },
    emerald: {
      bg: 'bg-emerald-500/20 hover:bg-emerald-500/30',
      border: 'border-emerald-500/50 hover:border-emerald-400',
      text: 'text-emerald-300 font-bold',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      glow: '#10b981'
    },
    ghost: {
      bg: 'bg-transparent hover:bg-neutral-800/60',
      border: 'border-transparent hover:border-neutral-700/60',
      text: 'text-neutral-400 hover:text-neutral-100 font-medium',
      shadow: '',
      glow: '#a1a1aa'
    },
    danger: {
      bg: 'bg-red-500/15 hover:bg-red-500/25',
      border: 'border-red-500/50 hover:border-red-400',
      text: 'text-red-300 font-bold',
      shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]',
      glow: '#ef4444'
    }
  };

  // Size Matrix
  const sizeStyles: Record<Button3DSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
    xl: 'px-8 py-4 text-lg rounded-2xl gap-3',
    icon: 'p-2.5 rounded-xl aspect-square justify-center'
  };

  const currentTheme = variantStyles[variant];
  const effectiveParticleColor = particleColor || currentTheme.glow;

  // 3D Tilt handling on mouse move (Desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 4.5;
    setTilt({
      x: (y / (rect.height / 2)) * -maxTilt,
      y: (x / (rect.width / 2)) * maxTilt
    });
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Double-click protection during active press cycle
    if (isLockedRef.current) {
      e.preventDefault();
      return;
    }
    isLockedRef.current = true;

    // Trigger Sound
    if (soundType !== 'none') {
      soundService.playButton3DPress(soundType === 'primary' ? 'primary' : 'secondary');
    }

    // Capture particle coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (enableParticles && !prefersReducedMotion()) {
      setBurstCoords({ x: clickX, y: clickY });
    }

    // Ripple effect
    setRipple({ x: localX, y: localY, active: true });

    // 3D Press Down Sequence (80-120ms)
    setIsPressed(true);

    const pressDuration = prefersReducedMotion() ? 30 : ANIMATION_CONFIG.button.pressDurationMs;
    const releaseDuration = prefersReducedMotion() ? 40 : ANIMATION_CONFIG.button.releaseDurationMs;

    // Step 1: Hold press down
    setTimeout(() => {
      // Step 2: Smooth release
      setIsPressed(false);
      setRipple(prev => ({ ...prev, active: false }));

      // Step 3: Trigger callback after press physically settles
      setTimeout(() => {
        isLockedRef.current = false;
        if (onClick) {
          onClick(e);
        }
      }, releaseDuration);
    }, pressDuration);
  };

  // 3D Transform computation
  const computeTransform = () => {
    if (prefersReducedMotion()) {
      return isPressed ? 'scale(0.98)' : 'scale(1)';
    }

    if (isPressed) {
      return 'perspective(800px) translate3d(0, 3px, -6px) scale(0.97)';
    }

    if (isHovered) {
      return `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate3d(0, -2px, 6px) scale(1.01)`;
    }

    return 'perspective(800px) translate3d(0, 0, 0) scale(1)';
  };

  return (
    <>
      <button
        ref={buttonRef}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: computeTransform(),
          transformStyle: 'preserve-3d',
          transition: isPressed 
            ? 'transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1)' 
            : 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease, border-color 220ms ease',
        }}
        className={`
          relative inline-flex items-center justify-center select-none overflow-hidden
          border font-sans transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400
          disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed
          ${currentTheme.bg}
          ${currentTheme.border}
          ${currentTheme.text}
          ${currentTheme.shadow}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Dynamic Light Sheen across top edge */}
        <span 
          className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none opacity-80" 
        />

        {/* Dynamic Ambient Hover Light Reflection */}
        {isHovered && !prefersReducedMotion() && (
          <span 
            className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none transition-opacity duration-300"
          />
        )}

        {/* Click Light Wave Pulse / Ripple */}
        {ripple.active && (
          <span
            className="absolute rounded-full pointer-events-none bg-white/35 animate-ping duration-300"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: '40px',
              height: '40px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Button Content with subtle 3D translation */}
        <span 
          className="relative z-10 flex items-center justify-center gap-2 pointer-events-none"
          style={{
            transform: isHovered && !prefersReducedMotion() ? 'translateZ(4px)' : 'translateZ(0)',
            transition: 'transform 180ms ease'
          }}
        >
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </span>
      </button>

      {/* Burst Particles attached globally */}
      {burstCoords && (
        <ParticleBurst
          x={burstCoords.x}
          y={burstCoords.y}
          color={effectiveParticleColor}
          onComplete={() => setBurstCoords(null)}
        />
      )}
    </>
  );
};
