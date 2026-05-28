'use client';

import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Flame, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChapterCard, type ChapterCardData } from '@/components/chapters/ChapterCard';
import { ChaptersFilter, type FilterStatus } from '@/components/chapters/ChaptersFilter';
import { CircularProgress } from '@/components/ui/ProgressBar/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function ChaptersPage() {
  const { data: session } = useSession();
  const [chapters,  setChapters]  = useState<ChapterCardData[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [status,    setStatus]    = useState<FilterStatus>('all');

  useEffect(() => {
    fetch('/api/chapters')
      .then((r) => r.json())
      .then((data: ChapterCardData[]) => { setChapters(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = chapters;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.titleSanskrit.includes(q) ||
          c.transliteration.toLowerCase().includes(q) ||
          c.summary?.toLowerCase().includes(q) ||
          String(c.number) === q,
      );
    }
    if (status === 'not-started') result = result.filter((c) => c.versesRead === 0);
    if (status === 'in-progress') result = result.filter((c) => c.versesRead > 0 && c.versesRead < c.verseCount);
    if (status === 'complete')    result = result.filter((c) => c.versesRead === c.verseCount);
    return result;
  }, [chapters, query, status]);

  const totalRead   = chapters.reduce((s, c) => s + c.versesRead, 0);
  const totalVerses = chapters.reduce((s, c) => s + c.verseCount, 0);
  const overallPct  = totalVerses > 0 ? Math.round((totalRead / totalVerses) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-saffron-500" />
            <p className="text-sm text-saffron-600 dark:text-saffron-400 font-medium uppercase tracking-widest">
              All Chapters
            </p>
          </div>
          <h1 className="font-serif text-3xl text-dark-900 dark:text-white">
            The Bhagavad Gita
          </h1>
          <p className="text-dark-400 dark:text-dark-500 text-sm mt-1">
            18 chapters · 700 verses · Timeless wisdom
          </p>
        </div>

        {/* Progress ring — only for signed-in users */}
        {session ? (
          <div className="flex items-center gap-4 bg-white dark:bg-dark-800 rounded-2xl border border-warm-100 dark:border-dark-700 p-4 self-start">
            <CircularProgress value={overallPct} size={60} strokeWidth={5} />
            <div>
              <p className="font-semibold text-dark-900 dark:text-white">{overallPct}% complete</p>
              <p className="text-sm text-dark-400 dark:text-dark-500">{totalRead} / {totalVerses} verses</p>
            </div>
          </div>
        ) : (
          <Link
            href="/register"
            className="flex items-center gap-3 bg-gradient-to-r from-saffron-50 to-gold-50 dark:from-saffron-900/20 dark:to-gold-900/10 rounded-2xl border border-saffron-200 dark:border-saffron-800 p-4 self-start hover:shadow-soft transition-shadow"
          >
            <Lock className="w-5 h-5 text-saffron-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-saffron-700 dark:text-saffron-300 text-sm">Track your progress</p>
              <p className="text-xs text-saffron-600/70 dark:text-saffron-400/70">Sign up free to save your reading journey</p>
            </div>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ChaptersFilter
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          totalCount={chapters.length}
          filteredCount={filtered.length}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-warm-100 dark:border-dark-700 p-6">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-20 mb-4" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((chapter) => (
            <ChapterCard key={chapter.number} chapter={chapter} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Flame className="w-12 h-12 text-dark-200 dark:text-dark-700 mx-auto mb-4" />
          <p className="text-dark-500 dark:text-dark-400 font-medium">No chapters match your search</p>
          <button
            onClick={() => { setQuery(''); setStatus('all'); }}
            className="mt-3 text-saffron-600 dark:text-saffron-400 text-sm underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
