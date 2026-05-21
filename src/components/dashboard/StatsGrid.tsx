import { BookOpen, Flame, Bookmark, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
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

export function StatsGrid() {
  const stats: StatCardProps[] = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Day streak',
      value: '7',
      sub: 'Personal best!',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-500',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Verses read',
      value: '47',
      sub: '6.7% complete',
      iconBg: 'bg-saffron-100 dark:bg-saffron-900/30',
      iconColor: 'text-saffron-600',
    },
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: 'Bookmarks',
      value: '12',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-500',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Time spent',
      value: '3h 20m',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <Card variant="elevated" className="p-4">
      <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-4 px-1">
        Your Stats
      </p>
      <div className="space-y-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </Card>
  );
}
