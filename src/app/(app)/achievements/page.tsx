'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AchievementBadge, { type Achievement } from '@/components/journey/AchievementBadge';
import { Trophy, Lock } from 'lucide-react';

// ─── Static fallback data ─────────────────────────────────────────────────────

const STATIC_ACHIEVEMENTS: Achievement[] = [
  { id: '1',  slug: 'first-step',       title: 'First Step',        description: 'Complete your first journey lesson',       icon: '👣', xpReward: 50,  rarity: 'COMMON',    unlockedAt: new Date().toISOString() },
  { id: '2',  slug: 'knowledge-seeker', title: 'Knowledge Seeker',  description: 'Complete 3 journey steps',                 icon: '📚', xpReward: 100, rarity: 'COMMON',    unlockedAt: null },
  { id: '3',  slug: 'halfway-there',    title: 'Halfway There',     description: 'Complete 4 of 8 journey steps',            icon: '🌓', xpReward: 150, rarity: 'RARE',      unlockedAt: null },
  { id: '4',  slug: 'journey-complete', title: 'Journey Complete',  description: 'Complete all 8 journey steps',             icon: '🏆', xpReward: 500, rarity: 'LEGENDARY', unlockedAt: null },
  { id: '5',  slug: 'quiz-master',      title: 'Quiz Master',       description: 'Score 100% on any quiz',                   icon: '🎯', xpReward: 200, rarity: 'RARE',      unlockedAt: null },
  { id: '6',  slug: 'verse-reader',     title: 'Verse Reader',      description: 'Read 10 verses',                           icon: '📖', xpReward: 50,  rarity: 'COMMON',    unlockedAt: new Date().toISOString() },
  { id: '7',  slug: 'deep-reader',      title: 'Deep Reader',       description: 'Read 100 verses',                          icon: '🌊', xpReward: 200, rarity: 'RARE',      unlockedAt: null },
  { id: '8',  slug: 'sacred-500',       title: 'Sacred 500',        description: 'Read 500 verses',                          icon: '🕉️', xpReward: 500, rarity: 'EPIC',      unlockedAt: null },
  { id: '9',  slug: 'week-streak',      title: 'Week of Wisdom',    description: 'Maintain a 7-day streak',                  icon: '🔥', xpReward: 150, rarity: 'COMMON',    unlockedAt: new Date().toISOString() },
  { id: '10', slug: 'month-streak',     title: 'Month of Devotion', description: 'Maintain a 30-day streak',                 icon: '💎', xpReward: 500, rarity: 'EPIC',      unlockedAt: null },
  { id: '11', slug: 'bookworm',         title: 'Bookworm',          description: 'Create 10 bookmarks',                      icon: '🔖', xpReward: 75,  rarity: 'COMMON',    unlockedAt: null },
  { id: '12', slug: 'first-note',       title: 'First Reflection',  description: 'Add a note to a bookmark',                 icon: '✍️', xpReward: 50,  rarity: 'COMMON',    unlockedAt: null },
];

const RARITY_ORDER = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

type FilterTab = 'all' | 'unlocked' | 'locked';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/achievements')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAchievements(data);
        else setAchievements(STATIC_ACHIEVEMENTS);
      })
      .catch(() => setAchievements(STATIC_ACHIEVEMENTS))
      .finally(() => setLoading(false));
  }, []);

  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;
  const totalXp = achievements
    .filter((a) => !!a.unlockedAt)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const filtered = achievements
    .filter((a) => {
      if (filter === 'unlocked') return !!a.unlockedAt;
      if (filter === 'locked') return !a.unlockedAt;
      return true;
    })
    .sort((a, b) => {
      // Unlocked first, then by rarity desc
      if (!!a.unlockedAt !== !!b.unlockedAt) return a.unlockedAt ? -1 : 1;
      return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
    });

  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-900 dark:text-warm-50">
            Achievements
          </h1>
          <p className="mt-1 text-warm-500">
            Your spiritual milestones on the path
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-dark-800">
            <div className="text-2xl font-bold text-dark-900 dark:text-warm-50">
              {unlockedCount}
            </div>
            <div className="text-xs text-warm-400">
              of {achievements.length} unlocked
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-dark-800">
            <div className="text-2xl font-bold text-saffron-600">{totalXp}</div>
            <div className="text-xs text-warm-400">XP earned</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-dark-800">
            <div className="text-2xl font-bold text-gold-600">
              {Math.round((unlockedCount / Math.max(achievements.length, 1)) * 100)}%
            </div>
            <div className="text-xs text-warm-400">completion</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-4 flex gap-2">
          {(['all', 'unlocked', 'locked'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all',
                filter === tab
                  ? 'bg-saffron-500 text-white'
                  : 'bg-white text-warm-500 hover:bg-warm-100 dark:bg-dark-800 dark:hover:bg-dark-700',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Achievement grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-warm-200 dark:bg-dark-700"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {filtered.map((ach) => (
              <div
                key={ach.id}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all',
                  ach.unlockedAt
                    ? 'border-warm-200 bg-white shadow-soft dark:border-dark-700 dark:bg-dark-800'
                    : 'border-warm-100 bg-warm-50/50 dark:border-dark-800 dark:bg-dark-900',
                )}
              >
                <AchievementBadge
                  achievement={ach}
                  size="md"
                  showDetails={false}
                />
                <div className="text-center">
                  <p
                    className={cn(
                      'text-xs font-medium leading-tight',
                      ach.unlockedAt
                        ? 'text-dark-800 dark:text-warm-200'
                        : 'text-warm-400',
                    )}
                  >
                    {ach.title}
                  </p>
                  {ach.unlockedAt ? (
                    <p className="mt-0.5 text-xs text-saffron-500">
                      +{ach.xpReward} XP
                    </p>
                  ) : (
                    <div className="mt-0.5 flex items-center justify-center gap-0.5 text-xs text-warm-300">
                      <Lock className="h-2.5 w-2.5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
                {/* Tooltip-style description on hover — using title attr */}
                <p className="sr-only">{ach.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Trophy className="h-10 w-10 text-warm-300" />
            <p className="text-warm-400">
              {filter === 'unlocked'
                ? 'No achievements unlocked yet — start your journey!'
                : 'All achievements unlocked — you are a true seeker!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
