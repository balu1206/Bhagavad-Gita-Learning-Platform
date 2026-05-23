'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Achievement } from './AchievementBadge';

interface AchievementUnlockToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export default function AchievementUnlockToast({
  achievement,
  onDismiss,
}: AchievementUnlockToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 4s
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={cn(
        'fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 md:bottom-6',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-gold-200 bg-white px-4 py-3 shadow-large dark:border-gold-800 dark:bg-dark-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-xl ring-2 ring-gold-300 dark:bg-gold-950/40 dark:ring-gold-600">
          {achievement.icon}
        </div>
        <div>
          <p className="text-xs font-medium text-gold-600 dark:text-gold-400">
            Achievement Unlocked!
          </p>
          <p className="text-sm font-semibold text-dark-900 dark:text-warm-100">
            {achievement.title}
          </p>
          <p className="text-xs text-warm-400">+{achievement.xpReward} XP</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="ml-2 text-warm-300 hover:text-warm-500"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
