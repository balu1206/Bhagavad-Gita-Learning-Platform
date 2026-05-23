'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { cn } from '@/lib/utils';

export interface ChapterCardData {
  number: number;
  slug: string;
  title: string;
  titleSanskrit: string;
  transliteration: string;
  summary?: string;
  verseCount: number;
  versesRead: number;
}

interface ChapterCardProps {
  chapter: ChapterCardData;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  const pct = chapter.verseCount > 0
    ? Math.round((chapter.versesRead / chapter.verseCount) * 100)
    : 0;

  const isComplete = pct === 100;
  const isStarted  = pct > 0 && pct < 100;

  return (
    <Link href={`/chapters/${chapter.number}`}>
      <Card
        variant="interactive"
        className="p-5 h-full flex flex-col group"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Chapter number badge */}
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold flex-shrink-0',
            isComplete ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            isStarted  ? 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400' :
                         'bg-warm-100 text-dark-400 dark:bg-dark-800 dark:text-dark-500',
          )}>
            {isComplete ? <CheckCircle2 className="w-5 h-5" /> : chapter.number}
          </div>

          <Badge
            variant={isComplete ? 'success' : isStarted ? 'warning' : 'default'}
            size="sm"
          >
            {isComplete ? 'Complete' : isStarted ? `${pct}%` : `${chapter.verseCount} verses`}
          </Badge>
        </div>

        {/* Title */}
        <div className="mb-3 flex-1">
          <p className="font-sanskrit text-sm text-saffron-600 dark:text-saffron-400 mb-0.5">
            {chapter.titleSanskrit}
          </p>
          <h3 className="font-serif text-base text-dark-900 dark:text-white leading-snug mb-1 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
            {chapter.title}
          </h3>
          <p className="text-xs text-dark-400 dark:text-dark-500 italic mb-3">
            {chapter.transliteration}
          </p>
          <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed line-clamp-3">
            {chapter.summary}
          </p>
        </div>

        {/* Progress footer */}
        <div className="mt-4 pt-4 border-t border-warm-100 dark:border-dark-700">
          {isStarted || isComplete ? (
            <>
              <div className="flex justify-between text-xs text-dark-400 mb-1.5">
                <span>{chapter.versesRead} / {chapter.verseCount} verses</span>
                <span className="text-saffron-600 dark:text-saffron-400 font-medium">{pct}%</span>
              </div>
              <ProgressBar value={pct} className="h-1.5" />
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-dark-400 dark:text-dark-500">
              <BookOpen className="w-3.5 h-3.5" />
              {chapter.verseCount} verses · Not started
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
