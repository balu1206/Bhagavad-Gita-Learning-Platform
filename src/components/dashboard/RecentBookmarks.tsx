import Link from 'next/link';
import { Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';

export interface RecentBookmark {
  id:        string;
  verseId:   string;
  note:      string | null;
  tags:      string[];
  createdAt: string;
  verse: {
    number:      number;
    slug:        string;
    translation: string;
    chapter:     { number: number; title: string };
  };
}

interface RecentBookmarksProps {
  bookmarks?: RecentBookmark[];
}

export function RecentBookmarks({ bookmarks = [] }: RecentBookmarksProps) {
  if (bookmarks.length === 0) {
    return (
      <Card variant="elevated" className="p-8 text-center">
        <Bookmark className="w-10 h-10 text-dark-300 dark:text-dark-600 mx-auto mb-3" />
        <p className="text-dark-500 dark:text-dark-400 font-medium mb-1">No bookmarks yet</p>
        <p className="text-dark-400 dark:text-dark-500 text-sm">
          Bookmark verses while reading to revisit them here.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-dark-900 dark:text-white">Recent Bookmarks</h2>
        <Link
          href="/bookmarks"
          className="flex items-center gap-1 text-saffron-600 dark:text-saffron-400 text-sm font-medium hover:gap-2 transition-all"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bm) => {
          const preview = bm.verse.translation.length > 100
            ? bm.verse.translation.slice(0, 97) + '...'
            : bm.verse.translation;
          return (
            <Link
              key={bm.id}
              href={`/chapters/${bm.verse.chapter.number}/${bm.verse.number}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-warm-100 dark:border-dark-700 hover:border-saffron-200 dark:hover:border-saffron-800 hover:bg-saffron-50/50 dark:hover:bg-saffron-900/10 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wide">
                    {bm.verse.chapter.number}.{bm.verse.number}
                  </span>
                  <span className="text-xs text-dark-400 dark:text-dark-500">
                    {bm.verse.chapter.title}
                  </span>
                </div>
                <p className="text-sm text-dark-600 dark:text-dark-300 truncate">{preview}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-dark-300 dark:text-dark-600 flex-shrink-0 mt-1 group-hover:text-saffron-500 transition-colors" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
