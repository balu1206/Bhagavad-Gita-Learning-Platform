'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, BookOpen, Settings,
  X, ArrowLeft, Bookmark, Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingShellProps {
  chapter: number;
  verse: number;
  totalVerses: number;
  chapterTitle: string;
  children: ReactNode;
}

export function ReadingShell({ chapter, verse, totalVerses, chapterTitle, children }: ReadingShellProps) {
  const router = useRouter();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  // PERF FIX: Track lastScrollY via ref so the scroll-listener effect doesn't
  // re-subscribe on every scroll event (each setLastScrollY would otherwise
  // tear down + reattach the listener — major jank on long scrolls).
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  // Collapse header on scroll down, reveal on scroll up.
  // Uses requestAnimationFrame throttling for smooth 60fps without thrashing.
  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const lastY = lastScrollYRef.current;
        setHeaderVisible(y < lastY || y < 60);
        lastScrollYRef.current = y;
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []); // Empty deps — listener mounts once, ref reads stay current

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'l') {
        if (verse < totalVerses) router.push(`/chapters/${chapter}/${verse + 1}`);
      }
      if (e.key === 'ArrowLeft' || e.key === 'h') {
        if (verse > 1) router.push(`/chapters/${chapter}/${verse - 1}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapter, verse, totalVerses, router]);

  const prevHref = verse > 1 ? `/chapters/${chapter}/${verse - 1}` : `/chapters/${chapter}`;
  const nextHref = verse < totalVerses
    ? `/chapters/${chapter}/${verse + 1}`
    : chapter < 18
    ? `/chapters/${chapter + 1}/1`
    : null;

  const progress = Math.round((verse / totalVerses) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex flex-col">
      {/* ── Collapsible top header ── */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-[1040] bg-white/95 dark:bg-dark-950/95 backdrop-blur-sm',
        'border-b border-warm-100 dark:border-dark-800 transition-transform duration-300',
        headerVisible ? 'translate-y-0' : '-translate-y-full',
      )}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Back */}
          <Link
            href={`/chapters/${chapter}`}
            className="flex items-center gap-1.5 text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{chapterTitle}</span>
          </Link>

          {/* Verse indicator */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-saffron-500" />
            <span className="font-medium text-dark-700 dark:text-dark-200 text-sm">
              {chapter}.{verse}
            </span>
            <span className="text-dark-300 dark:text-dark-600 text-sm">/ {chapter}.{totalVerses}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                bookmarked
                  ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-900/20'
                  : 'text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800',
              )}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              className="p-2 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Share verse"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Reading settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-warm-100 dark:bg-dark-800">
          <div
            className="h-full bg-gradient-to-r from-saffron-500 to-gold-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>

      {/* ── Sticky bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-[1040] bg-white/95 dark:bg-dark-950/95 backdrop-blur-sm border-t border-warm-100 dark:border-dark-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Prev */}
          <Link
            href={prevHref}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              verse > 1
                ? 'text-dark-600 dark:text-dark-300 hover:bg-warm-100 dark:hover:bg-dark-800'
                : 'text-dark-200 dark:text-dark-700 pointer-events-none',
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>

          {/* Verse counter + mini progress */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-dark-400 dark:text-dark-500">
              Verse {verse} of {totalVerses}
            </span>
            <div className="w-32 h-1 bg-warm-100 dark:bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Next */}
          {nextHref ? (
            <Link
              href={nextHref}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-saffron-500 text-white hover:bg-saffron-600 transition-colors"
            >
              <span className="hidden sm:inline">
                {verse < totalVerses ? 'Next' : 'Next Chapter'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white">
              <span className="hidden sm:inline">Complete!</span>
              <X className="w-4 h-4" />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
