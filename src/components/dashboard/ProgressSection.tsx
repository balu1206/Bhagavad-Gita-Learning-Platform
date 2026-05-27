import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { Badge } from '@/components/ui/Badge/Badge';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export interface ChapterProgressData {
  id:         string;
  number:     number;
  title:      string;
  verseCount: number;
  versesRead: number;
}

interface ProgressSectionProps {
  chapters?:   ChapterProgressData[];
  versesRead?: number;
}

export function ProgressSection({ chapters = [], versesRead = 0 }: ProgressSectionProps) {
  if (chapters.length === 0) return <ProgressSkeleton />;

  const totalVerses = chapters.reduce((s, c) => s + c.verseCount, 0);
  const overallPct  = totalVerses > 0 ? Math.round((versesRead / totalVerses) * 100) : 0;

  const relevantChapters = chapters
    .filter((c) => c.versesRead > 0 || c.number <= 4)
    .slice(0, 5);

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-dark-900 dark:text-white">Your Journey</h2>
          <p className="text-dark-400 dark:text-dark-500 text-sm">
            {overallPct}% of the Gita &middot; {versesRead} / {totalVerses} verses
          </p>
        </div>
        <Link
          href="/chapters"
          className="flex items-center gap-1 text-saffron-600 dark:text-saffron-400 text-sm font-medium hover:gap-2 transition-all"
        >
          All chapters <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mb-8">
        <ProgressBar value={overallPct} className="h-3" />
      </div>

      <div className="space-y-4">
        {relevantChapters.map((ch) => {
          const pct    = ch.verseCount > 0 ? Math.round((ch.versesRead / ch.verseCount) * 100) : 0;
          const status = ch.versesRead >= ch.verseCount ? 'complete'
                       : ch.versesRead > 0              ? 'reading'
                       :                                  'locked';
          return (
            <div key={ch.id} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                status === 'complete' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                status === 'reading'  ? 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400' :
                'bg-warm-100 text-dark-300 dark:bg-dark-800 dark:text-dark-600'
              }`}>
                {ch.number}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium truncate ${
                    status === 'locked'
                      ? 'text-dark-300 dark:text-dark-600'
                      : 'text-dark-700 dark:text-dark-200'
                  }`}>
                    {ch.title}
                  </span>
                  <span className="text-xs text-dark-400 ml-2 flex-shrink-0">
                    {ch.versesRead}/{ch.verseCount}
                  </span>
                </div>
                <ProgressBar value={pct} className="h-1.5" />
              </div>

              <Badge
                variant={
                  status === 'complete' ? 'success' :
                  status === 'reading'  ? 'warning' : 'default'
                }
                size="sm"
                className="flex-shrink-0"
              >
                {status === 'complete' ? 'Done' : status === 'reading' ? 'Reading' : 'Locked'}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ProgressSkeleton() {
  return (
    <Card variant="elevated" className="p-6">
      <div className="flex justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-3 w-full mb-8" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-1.5 w-full" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}
