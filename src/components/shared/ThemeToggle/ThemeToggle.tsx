'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'h-9 w-9 rounded-lg bg-warm-100 animate-pulse dark:bg-dark-800',
          className,
        )}
      />
    );
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ];

  const current = themes.find((t) => t.value === theme) ?? themes[0];
  const Icon = current.icon;

  const cycle = () => {
    const idx = themes.findIndex((t) => t.value === theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next.value);
  };

  return (
    <button
      onClick={cycle}
      aria-label={`Switch theme. Current: ${current.label}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-2.5 py-2',
        'text-dark-600 hover:bg-warm-100 hover:text-dark-900',
        'dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-dark-100',
        'transition-colors duration-150',
        'focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {showLabel && <span className="text-sm font-medium">{current.label}</span>}
    </button>
  );
}
