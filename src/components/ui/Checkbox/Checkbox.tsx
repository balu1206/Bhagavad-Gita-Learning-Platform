import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, helperText, error, className, id, ...props },
  ref,
) {
  const checkId = id ?? (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkId}
        className="inline-flex items-start gap-3 cursor-pointer group"
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          className={cn(
            'mt-0.5 h-4 w-4 rounded border-warm-100 bg-white',
            'text-saffron-500 accent-saffron-500',
            'focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
            'cursor-pointer transition-colors',
            'dark:border-dark-600 dark:bg-dark-850',
            error && 'border-red-500',
            className,
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-dark-700 dark:text-dark-200 leading-tight group-hover:text-dark-900 dark:group-hover:text-dark-100 transition-colors">
            {label}
          </span>
        )}
      </label>
      {helperText && !error && (
        <p className="ml-7 text-xs text-dark-500 dark:text-dark-400">{helperText}</p>
      )}
      {error && (
        <p role="alert" className="ml-7 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, helperText, className, id, ...props },
  ref,
) {
  const radioId = id ?? (label ? `radio-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={radioId}
        className="inline-flex items-start gap-3 cursor-pointer group"
      >
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={cn(
            'mt-0.5 h-4 w-4 border-warm-100 bg-white',
            'text-saffron-500 accent-saffron-500',
            'focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
            'cursor-pointer transition-colors',
            'dark:border-dark-600 dark:bg-dark-850',
            className,
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-dark-700 dark:text-dark-200 leading-tight group-hover:text-dark-900 dark:group-hover:text-dark-100 transition-colors">
            {label}
          </span>
        )}
      </label>
      {helperText && (
        <p className="ml-7 text-xs text-dark-500 dark:text-dark-400">{helperText}</p>
      )}
    </div>
  );
});
