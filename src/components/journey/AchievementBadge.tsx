'use client';

import { cn } from '@/lib/utils';

export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: AchievementRarity;
  unlockedAt?: string | null;
}

const RARITY_STYLES: Record<
  AchievementRarity,
  { ring: string; bg: string; label: string; text: string }
> = {
  COMMON: {
    ring: 'ring-warm-300',
    bg: 'bg-warm-100 dark:bg-dark-700',
    label: 'Common',
    text: 'text-warm-500',
  },
  RARE: {
    ring: 'ring-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    label: 'Rare',
    text: 'text-blue-600 dark:text-blue-400',
  },
  EPIC: {
    ring: 'ring-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    label: 'Epic',
    text: 'text-purple-600 dark:text-purple-400',
  },
  LEGENDARY: {
    ring: 'ring-gold-400',
    bg: 'bg-gold-50 dark:bg-gold-950/40',
    label: 'Legendary',
    text: 'text-gold-600 dark:text-gold-400',
  },
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function AchievementBadge({
  achievement,
  size = 'md',
  showDetails = false,
}: AchievementBadgeProps) {
  const unlocked = !!achievement.unlockedAt;
  const rarity = RARITY_STYLES[achievement.rarity];

  const iconSize = size === 'sm' ? 'h-10 w-10 text-xl' : size === 'lg' ? 'h-16 w-16 text-3xl' : 'h-12 w-12 text-2xl';

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2',
        !unlocked && 'opacity-40 grayscale',
      )}
      title={unlocked ? achievement.description : `Locked: ${achievement.description}`}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl ring-2 transition-all',
          iconSize,
          unlocked ? rarity.bg : 'bg-warm-100 dark:bg-dark-800',
          unlocked ? rarity.ring : 'ring-warm-200 dark:ring-dark-600',
          unlocked && 'shadow-soft',
        )}
      >
        <span role="img" aria-label={achievement.title}>
          {achievement.icon}
        </span>
      </div>

      {showDetails && (
        <div className="text-center">
          <p className={cn('text-xs font-medium', unlocked ? 'text-dark-800 dark:text-warm-200' : 'text-warm-400')}>
            {achievement.title}
          </p>
          {unlocked && (
            <p className={cn('text-xs', rarity.text)}>{rarity.label}</p>
          )}
        </div>
      )}
    </div>
  );
}
