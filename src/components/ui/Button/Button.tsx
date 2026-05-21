import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner/Spinner';

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
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200 focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Variants
        variant === 'primary' && [
          'bg-gradient-primary text-white shadow-medium',
          'hover:shadow-large hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-soft',
        ],
        variant === 'secondary' && [
          'bg-white border-2 border-saffron-500 text-saffron-600',
          'hover:bg-saffron-50 dark:bg-transparent dark:hover:bg-saffron-900/20',
        ],
        variant === 'ghost' && [
          'bg-transparent border border-warm-100 text-dark-700',
          'hover:bg-warm-100 dark:border-dark-700 dark:text-dark-200 dark:hover:bg-dark-800',
        ],
        variant === 'danger' && [
          'bg-red-600 text-white shadow-medium',
          'hover:bg-red-700 hover:shadow-large hover:-translate-y-0.5',
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
