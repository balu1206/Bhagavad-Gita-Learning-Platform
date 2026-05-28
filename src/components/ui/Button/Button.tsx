import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner/Spinner';

/**
 * Two canonical button styles:
 *  primary   — filled saffron/orange gradient, white text
 *  secondary — transparent with saffron border + saffron text
 *
 * ghost and danger are kept as aliases for internal use but map to the two styles.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-200 focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Primary — filled saffron, white text
        (variant === 'primary' || variant === 'danger') && [
          variant === 'danger'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-r from-saffron-500 to-gold-500',
          'text-white shadow-medium',
          'hover:shadow-large hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-soft',
        ],
        // Secondary — transparent with orange border + text
        (variant === 'secondary' || variant === 'ghost') && [
          'bg-transparent border-2 border-saffron-500 text-saffron-600 dark:text-saffron-400',
          'hover:bg-saffron-50 dark:hover:bg-saffron-950/30',
        ],
        // Sizes
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-12 px-6 text-base',
        size === 'xl' && 'h-14 px-8 text-lg',
        // Full width
        fullWidth && 'w-full',
        className,
      )}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="text-current opacity-70" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
