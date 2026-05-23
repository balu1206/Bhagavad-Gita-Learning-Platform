'use client';

import { cn } from '@/lib/utils';
import { Flame, Zap, Trophy } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  className?: string;
}

function XPBar({ xp, level }: { xp: number; level: number }) {
  const xpForThisLevel = level * 200;
  const xpPrevLevels = ((level - 1) * level) / 2 * 200; // sum of all previous level XP requirements
  const xpIntoCurrentLevel = xp - xpPrevLevels;
  const progress = Math.min(100, Math.round((xpIntoCurrentLevel / xpForThisLevel) * 100));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 font-medium text-dark-800 dark:text-warm-200">
          <Zap className="h-3.5 w-3.5 text-saffron-500" />
          Level {level}
        </div>
        <span className="text-warm-400">{xp.toLocaleString()} XP total</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-warm-100 dark:bg-dark-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 text-right text-xs text-warm-400">
        {progress}% to level {level + 1}
      </div>
    </div>
  );
}

export default function StreakCard({
  currentStreak,
  longestStreak,
  totalXp,
  level,
  className,
}: StreakCardProps) {
  const streakLabel =
    currentStreak >= 30
      ? 'Month of devotion! 🏆'
      : currentStreak >= 7
        ? 'Week warrior! 🔥'
        : currentStreak >= 3
          ? 'Building momentum'
          : currentStreak > 0
            ? 'Keep going!'
            : 'Start your streak today';

  return (
    <div
      className={cn(
        'rounded-2xl border border-warm-200 bg-white p-4 shadow-soft dark:border-dark-700 dark:bg-dark-800',
        className,
      )}
    >
      {/* Streak display */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/30">
            <Flame
              className={cn(
                'h-5 w-5',
                currentStreak > 0 ? 'text-orange-500' : 'text-warm-300',
              )}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-dark-900 dark:text-warm-50">
                {currentStreak}
              </span>
              <span className="text-sm text-warm-400">day streak</span>
            </div>
            <p className="text-xs text-warm-400">{streakLabel}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-warm-400">
            <Trophy className="h-3 w-3 text-gold-500" />
            Best: {longestStreak}d
          </div>
        </div>
      </div>

      {/* Streak mini-calendar: last 7 days */}
      <div className="mb-4 flex items-center justify-between gap-1">
        {Array.from({ length: 7 }).map((_, i) => {
          const daysAgo = 6 - i;
          const active = daysAgo < currentStreak;
          const isToday = daysAgo === 0;
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const date = new Date();
          date.setDate(date.getDate() - daysAgo);
          const dayName = dayNames[date.getDay()].substring(0, 1);

          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-warm-300">{dayName}</span>
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-all',
                  active
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                    : 'bg-warm-100 text-warm-300 dark:bg-dark-700',
                  isToday && active && 'ring-2 ring-orange-400',
                )}
              >
                {active ? '🔥' : '·'}
              </div>
            </div>
          );
        })}
      </div>

      {/* XP bar */}
      <XPBar xp={totalXp} level={level} />
    </div>
  );
}
