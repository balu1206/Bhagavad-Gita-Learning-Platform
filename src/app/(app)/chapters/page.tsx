'use client';

import { useState, useMemo, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChapterCard, type ChapterCardData } from '@/components/chapters/ChapterCard';
import { ChaptersFilter, type FilterStatus } from '@/components/chapters/ChaptersFilter';

interface LastRead { chapter: number; verse: number; title: string; ts: number; }

export default function ChaptersPage() {
  const { data: session } = useSession();
  const [chapters,  setChapters]  = useState<ChapterCardData[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [status,    setStatus]    = useState<FilterStatus>('all');
  const [lastRead,  setLastRead]  = useState<LastRead | null>(null);

  useEffect(() => {
    fetch('/api/chapters')
      .then((r) => r.json())
      .then((data: ChapterCardData[]) => { setChapters(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gita_last_read');
      if (raw) setLastRead(JSON.parse(raw) as LastRead);
    } catch { /* ignore */ }
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

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16">

        {lastRead && (
          <Link
            href={`/chapters/${lastRead.chapter}/${lastRead.verse}`}
            className="group flex items-center justify-between gap-4 mb-10 bezel-card"
          >
            <div className="bezel-core w-full px-6 py-4 flex items-center justify-between gap-4 transition-all duration-500">
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-sanskrit text-xl text-saffron-500 dark:text-saffron-400 flex-shrink-0">॰</span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-saffron-600 dark:text-saffron-500 mb-0.5">Continue reading</p>
                  <p className="font-display text-base font-semibold text-dark-900 dark:text-cream-100 truncate">
                    Chapter {lastRead.chapter}, Verse {lastRead.verse}
                    {lastRead.title && <span className="text-dark-400 dark:text-dark-500 font-normal"> · {lastRead.title}</span>}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-saffron-400 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="eyebrow mb-4">All Chapters</div>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-dark-900 dark:text-cream-100 leading-[1.0] tracking-[-0.03em] mb-3">
              The Bhagavad<br />
              <em className="text-gradient not-italic">Gita</em>
            </h1>
            <p className="text-dark-400 dark:text-dark-500 font-light">
              18 chapters · 700 verses · Timeless wisdom
            </p>
          </div>

          {!session && (
            <Link href="/register" className="group bezel-card self-start sm:self-end flex-shrink-0">
              <div className="bezel-core px-5 py-4 flex items-center gap-3 transition-all duration-500">
                <Lock className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                <div>
                  <p className="font-display font-semibold text-dark-900 dark:text-cream-100 text-sm">Track your progress</p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 font-light">Sign up free</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="mb-8">
          <ChaptersFilter
            query={query}
            status={status}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            totalCount={chapters.length}
            filteredCount={filtered.length}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="bezel-card animate-pulse">
                <div className="bezel-core p-6 h-52" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((chapter, i) => (
              <ChapterCard key={chapter.number} chapter={chapter} delay={i * 40} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-sanskrit text-4xl text-dark-200 dark:text-dark-700 mb-4">ॐ</p>
            <p className="font-display text-lg font-semibold text-dark-500 dark:text-dark-400 mb-2">No chapters match</p>
            <button
              onClick={() => { setQuery(''); setStatus('all'); }}
              className="text-saffron-600 dark:text-saffron-400 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
