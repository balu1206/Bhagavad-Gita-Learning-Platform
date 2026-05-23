import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        // Sizes
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-xs',
        // Variants
        variant === 'default' && 'bg-dark-100 text-dark-700 dark:bg-dark-700 dark:text-dark-200',
        variant === 'primary' && 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300',
        variant === 'success' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        variant === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        variant === 'danger' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        variant === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        variant === 'outline' && 'border border-current bg-transparent text-dark-600 dark:text-dark-300',
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'primary' && 'bg-saffron-500',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            (variant === 'default' || variant === 'outline') && 'bg-dark-400',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
