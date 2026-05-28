import { BookOpen, Flame, Bookmark, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

interface StatCardProps {
  icon:      React.ReactNode;
  label:     string;
  value:     string;
  sub?:      string;
  iconBg:    string;
  iconColor: string;
}

function StatCard({ icon, label, value, sub, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-dark-800 rounded-xl border border-warm-100 dark:border-dark-700">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div>
        <p className="font-semibold text-dark-900 dark:text-white text-lg leading-none">{value}</p>
        <p className="text-dark-400 dark:text-dark-500 text-xs mt-0.5">{label}</p>
        {sub && <p className="text-saffron-600 dark:text-saffron-400 text-xs font-medium">{sub}</p>}
      </div>
    </div>
  );
}

export interface StatsData {
  versesRead:     number;
  bookmarksCount: number;
  currentStreak:  number;
  longestStreak:  number;
  totalXp:        number;
}

interface StatsGridProps {
  stats?: StatsData | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return <StatsGridSkeleton />;

  const totalVerses = 700;
  const pct = Math.round((stats.versesRead / totalVerses) * 100);

  const statCards: StatCardProps[] = [
    {
      icon:      <Flame className="w-5 h-5" />,
      label:     'Day streak',
      value:     String(stats.currentStreak),
      sub:       stats.currentStreak > 0 && stats.currentStreak === stats.longestStreak
                   ? 'Personal best!'
                   : stats.currentStreak > 0
                   ? `Best: ${stats.longestStreak}`
                   : undefined,
      iconBg:    'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-500',
    },
    {
      icon:      <BookOpen className="w-5 h-5" />,
      label:     'Verses read',
      value:     String(stats.versesRead),
      sub:       `${pct}% complete`,
      iconBg:    'bg-saffron-100 dark:bg-saffron-900/30',
      iconColor: 'text-saffron-600',
    },
    {
      icon:      <Bookmark className="w-5 h-5" />,
      label:     'Bookmarks',
      value:     String(stats.bookmarksCount),
      iconBg:    'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-500',
    },
    {
      icon:      <Trophy className="w-5 h-5" />,
      label:     'Total XP',
      value:     stats.totalXp >= 1000
                   ? `${(stats.totalXp / 1000).toFixed(1)}k`
                   : String(stats.totalXp),
      iconBg:    'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <Card variant="elevated" className="p-4">
      <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-4 px-1">
        Your Stats
      </p>
      <div className="space-y-3">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </Card>
  );
}

function StatsGridSkeleton() {
  return (
    <Card variant="elevated" className="p-4">
      <Skeleton className="h-3 w-20 mb-4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-warm-100 dark:border-dark-700">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
