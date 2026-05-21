'use client';

import { useState } from 'react';
import { Moon, X } from 'lucide-react';
import { useSleepTimer, type SleepOption } from '@/hooks/useSleepTimer';
import { cn } from '@/lib/utils';

const OPTIONS: { value: SleepOption; label: string }[] = [
  { value: 5,             label: '5 min' },
  { value: 10,            label: '10 min' },
  { value: 15,            label: '15 min' },
  { value: 30,            label: '30 min' },
  { value: 45,            label: '45 min' },
  { value: 60,            label: '1 hour' },
  { value: 'end-of-verse', label: 'End of verse' },
];

function formatRemaining(secs: number): string {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function SleepTimerButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const timer = useSleepTimer();

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          timer.isActive
            ? 'bg-saffron-900/40 text-saffron-300 border border-saffron-700/50'
            : 'bg-dark-800 text-dark-400 hover:text-white border border-transparent',
        )}
        aria-label="Sleep timer"
      >
        <Moon className="w-3.5 h-3.5" />
        {timer.isActive
          ? timer.remaining !== null
            ? formatRemaining(timer.remaining)
            : 'End of verse'
          : 'Sleep'
        }
        {timer.isActive && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); timer.cancel(); setOpen(false); }}
            className="ml-1 hover:text-red-400 transition-colors"
            aria-label="Cancel sleep timer"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 bg-dark-800 border border-dark-700 rounded-xl shadow-large p-2 min-w-[140px] z-10 animate-scale-in">
          {OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => { timer.start(opt.value); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors',
                timer.option === opt.value
                  ? 'bg-saffron-500/20 text-saffron-300'
                  : 'text-dark-300 hover:bg-dark-700 hover:text-white',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
