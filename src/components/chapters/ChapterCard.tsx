'use client';

import Link from 'next/link';
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
  delay?: number;
}

export function ChapterCard({ chapter, delay = 0 }: ChapterCardProps) {
  const pct        = chapter.verseCount > 0 ? Math.round((chapter.versesRead / chapter.verseCount) * 100) : 0;
  const isComplete = pct === 100;
  const isStarted  = pct > 0 && pct < 100;

  return (
    <Link
      href={`/chapters/${chapter.number}/1`}
      className="group block bezel-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bezel-core p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className={cn(
            'font-display text-4xl font-semibold leading-none tabular',
            isComplete ? 'text-gradient' : 'text-warm-300 dark:text-dark-700',
          )}>
            {String(chapter.number).padStart(2, '0')}
          </span>
          {(isStarted || isComplete) && (
            <span className={cn(
              'text-[10px] uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-full',
              isComplete
                ? 'bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400'
                : 'bg-warm-200 dark:bg-dark-800 text-dark-500 dark:text-dark-400',
            )}>
              {isComplete ? 'Complete' : `${pct}%`}
            </span>
          )}
        </div>

        <div>
          <p className="font-sanskrit text-base text-saffron-500 dark:text-saffron-400 mb-1 leading-relaxed">
            {chapter.titleSanskrit}
          </p>
          <h3 className="font-display text-xl font-semibold text-dark-900 dark:text-cream-100 leading-tight tracking-tight group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors duration-300">
            {chapter.title}
          </h3>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5 italic">{chapter.transliteration}</p>
        </div>

        {chapter.summary && (
          <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed line-clamp-2 font-light">
            {chapter.summary}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto border-t border-warm-100/80 dark:border-dark-700/80">
          {isStarted || isComplete ? (
            <div className="w-full">
              <div className="flex justify-between text-xs text-dark-400 dark:text-dark-500 mb-1.5">
                <span className="tabular">{chapter.versesRead} / {chapter.verseCount}</span>
                <span className="font-medium text-saffron-600 dark:text-saffron-400 tabular">{pct}%</span>
              </div>
              <div className="h-0.5 rounded-full bg-warm-200 dark:bg-dark-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-gold-400 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="text-xs text-dark-400 dark:text-dark-500 tabular">{chapter.verseCount} verses</span>
          )}
          <svg className="w-4 h-4 text-saffron-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300 ml-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </div>
      </div>
    </Link>
  );
}
