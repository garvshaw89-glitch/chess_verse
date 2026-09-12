import React, { Children, isValidElement } from 'react';
import { prefersReducedMotion } from '../../config/animationConfig';

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerMs?: number;
  baseDelayMs?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerMs = 65,
  baseDelayMs = 40,
  className = ''
}) => {
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const delay = baseDelayMs + index * staggerMs;

        return (
          <div
            key={index}
            style={{
              animation: `staggerFadeUp 420ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`
            }}
            className="w-full"
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
