import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { Badge } from '@/components/ui/Badge/Badge';

const CHAPTER_PREVIEWS = [
  { number: 1, title: 'Arjuna Vishada Yoga', verses: 47, read: 47, status: 'complete' as const },
  { number: 2, title: 'Sankhya Yoga',         verses: 72, read: 47, status: 'reading' as const },
  { number: 3, title: 'Karma Yoga',            verses: 43, read: 0,  status: 'locked' as const },
  { number: 4, title: 'Jnana Karma Sanyasa',   verses: 42, read: 0,  status: 'locked' as const },
];

export function ProgressSection() {
  const overallPct = Math.round((47 + 47) / 700 * 100); // placeholder

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-dark-900 dark:text-white">Your Journey</h2>
          <p className="text-dark-400 dark:text-dark-500 text-sm">
            {overallPct}% of the Gita · 94 / 700 verses
          </p>
        </div>
        <Link
          href="/chapters"
          className="flex items-center gap-1 text-saffron-600 dark:text-saffron-400 text-sm font-medium hover:gap-2 transition-all"
        >
          All chapters <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overall bar */}
      <div className="mb-8">
        <ProgressBar value={overallPct} className="h-3" />
      </div>

      {/* Chapter rows */}
      <div className="space-y-4">
        {CHAPTER_PREVIEWS.map((ch) => {
          const pct = ch.verses > 0 ? Math.round((ch.read / ch.verses) * 100) : 0;
          return (
            <div key={ch.number} className="flex items-center gap-4">
              {/* Chapter number bubble */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                ch.status === 'complete' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                ch.status === 'reading'  ? 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400' :
                'bg-warm-100 text-dark-300 dark:bg-dark-800 dark:text-dark-600'
              }`}>
                {ch.number}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium truncate ${
                    ch.status === 'locked'
                      ? 'text-dark-300 dark:text-dark-600'
                      : 'text-dark-700 dark:text-dark-200'
                  }`}>
                    {ch.title}
                  </span>
                  <span className="text-xs text-dark-400 ml-2 flex-shrink-0">
                    {ch.read}/{ch.verses}
                  </span>
                </div>
                <ProgressBar value={pct} className="h-1.5" />
              </div>

              <Badge
                variant={
                  ch.status === 'complete' ? 'success' :
                  ch.status === 'reading'  ? 'warning' : 'default'
                }
                size="sm"
                className="flex-shrink-0"
              >
                {ch.status === 'complete' ? '✓' : ch.status === 'reading' ? 'Reading' : 'Locked'}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
