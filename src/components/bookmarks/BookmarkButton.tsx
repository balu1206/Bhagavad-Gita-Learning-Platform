'use client';

import { useState, useCallback } from 'react';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  verseId:   string;
  chapterId: string;
  initialBookmarked?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  onToggle?: (bookmarked: boolean) => void;
}

export function BookmarkButton({
  verseId, chapterId, initialBookmarked = false,
  size = 'md', className, onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading,    setLoading]    = useState(false);
  const [animate,    setAnimate]    = useState(false);

  const toggle = useCallback(async () => {
    if (loading) return;
    const next = !bookmarked;

    // Optimistic update
    setBookmarked(next);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);
    onToggle?.(next);
    setLoading(true);

    try {
      if (next) {
        await fetch('/api/bookmarks', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ verseId, chapterId }),
        });
      } else {
        await fetch(`/api/bookmarks?verseId=${encodeURIComponent(verseId)}`, {
          method: 'DELETE',
        });
      }
    } catch {
      // Revert on error
      setBookmarked(!next);
      onToggle?.(!next);
    } finally {
      setLoading(false);
    }
  }, [bookmarked, loading, verseId, chapterId, onToggle]);

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
      aria-pressed={bookmarked}
      className={cn(
        'rounded-lg transition-all duration-200 flex items-center justify-center',
        size === 'sm' ? 'p-1.5' : 'p-2',
        bookmarked
          ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-900/20 hover:bg-saffron-100 dark:hover:bg-saffron-900/30'
          : 'text-dark-400 hover:text-saffron-500 hover:bg-saffron-50 dark:hover:bg-saffron-900/10',
        animate && 'scale-125',
        className,
      )}
    >
      <Bookmark
        className={cn(
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
          'transition-all duration-200',
        )}
        fill={bookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
}
