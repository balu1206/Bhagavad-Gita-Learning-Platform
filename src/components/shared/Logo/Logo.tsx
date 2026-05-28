import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

// ISSUE-020 / DS-002: Canonical Logo component for consistent sizing
// across the app. Use this instead of inline flame + gradient containers.

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  showLabel?: boolean;
  className?: string;
  /**
   * Inverts colors for use on dark/gradient backgrounds.
   * When true, the label text is white instead of dark.
   */
  inverse?: boolean;
}

const SIZE_MAP: Record<LogoSize, { container: string; icon: string; label: string }> = {
  sm: { container: 'h-7 w-7 rounded-md', icon: 'h-3.5 w-3.5', label: 'text-base' },
  md: { container: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4',     label: 'text-lg'  },
  lg: { container: 'h-10 w-10 rounded-xl', icon: 'h-5 w-5',   label: 'text-xl'  },
};

export function Logo({ size = 'md', showLabel = true, className, inverse = false }: LogoProps) {
  const s = SIZE_MAP[size];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className={cn(
        'flex items-center justify-center shadow-glow bg-gradient-to-br from-saffron-500 to-gold-500',
        s.container,
      )}>
        <Flame className={cn('text-white', s.icon)} aria-hidden="true" />
      </div>
      {showLabel && (
        <span className={cn(
          'font-serif font-bold',
          s.label,
          inverse ? 'text-white' : 'text-dark-900 dark:text-warm-50',
        )}>
          Gita Learning
        </span>
      )}
    </div>
  );
}
