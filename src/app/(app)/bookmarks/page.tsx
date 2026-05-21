'use client';

import { useState, useMemo, useCallback } from 'react';
import { Bookmark, LayoutGrid, List, Search, X, SlidersHorizontal, Download } from 'lucide-react';
import { BookmarkCard, type BookmarkData } from '@/components/bookmarks/BookmarkCard';
import { BookmarkDetailModal } from '@/components/bookmarks/BookmarkDetailModal';
import { Input } from '@/components/ui/Input/Input';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils';

// Placeholder data — replaced with real API fetch (useSWR/React Query) in integration pass
const PLACEHOLDER: BookmarkData[] = [
  {
    id: '1', verseId: 'v1', note: 'The central teaching of the Gita — act without attachment.',
    tags: ['karma-yoga', 'action', 'favourite'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    verse: { number: 47, slug: '2-47', sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।', translation: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits.', chapter: { number: 2, title: 'Sankhya Yoga' } },
  },
  {
    id: '2', verseId: 'v2', note: null, tags: ['devotion'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    verse: { number: 7,  slug: '4-7',  sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।', translation: 'Whenever and wherever there is a decline in righteousness, I manifest myself personally.', chapter: { number: 4, title: 'Jnana Karma Sanyasa Yoga' } },
  },
  {
    id: '3', verseId: 'v3', note: 'Power of surrender.', tags: ['bhakti', 'surrender'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    verse: { number: 66, slug: '18-66', sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।', translation: 'Abandon all varieties of religion and just surrender unto me.', chapter: { number: 18, title: 'Moksha Sanyasa Yoga' } },
  },
  {
    id: '4', verseId: 'v4', note: null, tags: ['meditation', 'self'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    verse: { number: 5,  slug: '6-5',  sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।', translation: 'A person must elevate himself with the help of his mind, and not degrade himself.', chapter: { number: 6, title: 'Dhyana Yoga' } },
  },
];

type SortOption = 'newest' | 'oldest' | 'chapter';
type ViewMode   = 'grid'   | 'list';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks]     = useState<BookmarkData[]>(PLACEHOLDER);
  const [view,      setView]          = useState<ViewMode>('grid');
  const [query,     setQuery]         = useState('');
  const [sort,      setSort]          = useState<SortOption>('newest');
  const [chapter,   setChapter]       = useState<number | null>(null);
  const [editing,   setEditing]       = useState<BookmarkData | null>(null);

  // Debounced search
  const debouncedSet = useMemo(() => debounce((...args: unknown[]) => setQuery(args[0] as string), 300), []);

  const filtered = useMemo(() => {
    let r = bookmarks;
    if (chapter !== null) r = r.filter((b) => b.verse.chapter.number === chapter);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((b) =>
        b.verse.translation.toLowerCase().includes(q) ||
        b.verse.sanskrit.includes(q) ||
        b.note?.toLowerCase().includes(q) ||
        b.tags.some((t) => t.includes(q)),
      );
    }
    if (sort === 'oldest') return [...r].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (sort === 'chapter') return [...r].sort((a, b) => a.verse.chapter.number - b.verse.chapter.number || a.verse.number - b.verse.number);
    return [...r].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookmarks, query, sort, chapter]);

  const handleDelete = useCallback(async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' }).catch(() => null);
  }, []);

  const handleSave = useCallback(async (id: string, note: string, tags: string[]) => {
    setBookmarks((prev) => prev.map((b) => b.id === id ? { ...b, note, tags } : b));
    await fetch(`/api/bookmarks/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ note, tags }),
    }).catch(() => null);
  }, []);

  const exportCSV = useCallback(() => {
    const rows = [
      ['Verse', 'Chapter', 'Translation', 'Note', 'Tags', 'Saved'],
      ...bookmarks.map((b) => [
        `${b.verse.chapter.number}.${b.verse.number}`,
        b.verse.chapter.title,
        `"${b.verse.translation.replace(/"/g, '""')}"`,
        `"${(b.note ?? '').replace(/"/g, '""')}"`,
        b.tags.join('; '),
        new Date(b.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv  = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'gita-bookmarks.csv' });
    a.click(); URL.revokeObjectURL(url);
  }, [bookmarks]);

  const uniqueChapters = useMemo(() =>
    [...new Set(bookmarks.map((b) => b.verse.chapter.number))].sort((a, b) => a - b),
  [bookmarks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-saffron-500" />
            <p className="text-sm text-saffron-600 dark:text-saffron-400 font-medium uppercase tracking-widest">Bookmarks</p>
          </div>
          <h1 className="font-serif text-3xl text-dark-900 dark:text-white">Your Saved Verses</h1>
          <p className="text-dark-400 dark:text-dark-500 text-sm mt-1">{bookmarks.length} verses saved</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warm-200 dark:border-dark-700 text-dark-500 dark:text-dark-400 hover:border-saffron-300 hover:text-saffron-600 text-sm transition-all"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input
            placeholder="Search bookmarks…"
            leftIcon={<Search className="w-4 h-4" />}
            onChange={(e) => debouncedSet(e.target.value)}
            rightIcon={query
              ? <button onClick={() => { setQuery(''); }} className="text-dark-400 hover:text-dark-600"><X className="w-4 h-4" /></button>
              : undefined}
          />
        </div>

        {/* Chapter filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-dark-400 flex-shrink-0" />
          <button
            onClick={() => setChapter(null)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              chapter === null ? 'bg-saffron-500 text-white' : 'bg-warm-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 hover:bg-warm-200 dark:hover:bg-dark-700'
            )}
          >All</button>
          {uniqueChapters.map((n) => (
            <button key={n}
              onClick={() => setChapter(chapter === n ? null : n)}
              className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                chapter === n ? 'bg-saffron-500 text-white' : 'bg-warm-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 hover:bg-warm-200 dark:hover:bg-dark-700'
              )}
            >Ch {n}</button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-3 py-1.5 rounded-lg border border-warm-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-sm text-dark-600 dark:text-dark-300 focus:outline-none focus:ring-2 focus:ring-saffron-500/40"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="chapter">By chapter</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-warm-200 dark:border-dark-700 overflow-hidden ml-auto">
          {(['grid', 'list'] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={cn('p-2 transition-colors',
                view === v ? 'bg-saffron-500 text-white' : 'text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 bg-white dark:bg-dark-900'
              )}
              aria-label={`${v} view`}
            >
              {v === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {(query || chapter !== null) && (
        <p className="text-sm text-dark-400 dark:text-dark-500 mb-4">
          Showing {filtered.length} of {bookmarks.length} bookmarks
        </p>
      )}

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Bookmark className="w-12 h-12 text-dark-200 dark:text-dark-700 mx-auto mb-4" />
          <p className="text-dark-500 dark:text-dark-400 font-medium">
            {query || chapter !== null ? 'No bookmarks match your filters' : 'No bookmarks yet'}
          </p>
          <p className="text-dark-400 dark:text-dark-500 text-sm mt-1">
            {query || chapter !== null ? 'Try clearing your search or filters'
              : 'Bookmark verses while reading to save them here'}
          </p>
        </div>
      ) : (
        <div className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3',
        )}>
          {filtered.map((b) => (
            <BookmarkCard
              key={b.id} bookmark={b} view={view}
              onEdit={setEditing} onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BookmarkDetailModal
        bookmark={editing} isOpen={editing !== null}
        onClose={() => setEditing(null)} onSave={handleSave}
      />
    </div>
  );
}
