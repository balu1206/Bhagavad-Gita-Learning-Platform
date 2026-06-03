'use client';

// BUG-001 (real root cause): Card needs `'use client'` because the interactive
// variant attaches an onKeyDown function handler. Without this directive, when
// Card is rendered inside a Server Component (e.g. the dashboard via
// RecommendedScroller), Next.js can't serialize the function reference across
// the server→client boundary and throws "Event handlers cannot be passed to
// Client Component props" — surfacing in production as digest 2464001999.

import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type CardVariant = 'default' | 'elevated' | 'interactive' | 'ghost';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  onClick,
  ...props
}: CardProps) {
  const isInteractive = variant === 'interactive' || Boolean(onClick);

  return (
    <div
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      onKeyDown={
        isInteractive
          ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(e as never); }
          : undefined
      }
      className={cn(
        'rounded-xl border',
        'bg-white border-warm-100 dark:bg-dark-850 dark:border-dark-700',
        // Variants
        variant === 'default' && 'shadow-soft',
        variant === 'elevated' && 'shadow-medium',
        variant === 'interactive' && [
          'shadow-soft cursor-pointer',
          'hover:shadow-medium hover:-translate-y-0.5 hover:border-saffron-200',
          'dark:hover:border-saffron-900',
          'transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus:outline-none',
        ],
        variant === 'ghost' && 'border-transparent shadow-none bg-transparent dark:bg-transparent',
        // Padding
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-6',
        padding === 'lg' && 'p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
