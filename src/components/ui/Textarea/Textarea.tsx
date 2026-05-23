import { cn } from '@/lib/utils';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helperText, error, fullWidth = true, resize = 'vertical', className, id, ...props },
  ref,
) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);

  const resizeClass = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  }[resize];

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={textareaId} className="label">
          {label}
          {props.required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={hasError}
        aria-describedby={
          [error ? `${textareaId}-error` : null, helperText ? `${textareaId}-helper` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        rows={4}
        className={cn(
          'w-full px-4 py-3 rounded-lg',
          'bg-white border border-warm-100',
          'text-base text-dark-900 placeholder:text-dark-400',
          'focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 focus:outline-none',
          'transition-colors duration-150',
          'disabled:bg-warm-100 disabled:cursor-not-allowed',
          'dark:bg-dark-850 dark:border-dark-700 dark:text-dark-100',
          hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          resizeClass,
          className,
        )}
        {...props}
      />

      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="text-xs text-dark-500 dark:text-dark-400">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${textareaId}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});
