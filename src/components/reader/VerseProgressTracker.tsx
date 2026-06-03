'use client';

import { useEffect } from 'react';

interface VerseProgressTrackerProps {
  verseId:       string;
  chapterId:     string;
  chapterNumber?: number;
  verseNumber?:   number;
  chapterTitle?:  string;
}

/**
 * Invisible component — fires POST /api/progress once when a verse is viewed.
 * Also saves the last-read verse to localStorage for the "Continue Reading" banner.
 * Keeps the verse page itself as a pure server component.
 */
export function VerseProgressTracker({ verseId, chapterId, chapterNumber, verseNumber, chapterTitle }: VerseProgressTrackerProps) {
  useEffect(() => {
    fetch('/api/progress', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ verseId, chapterId }),
    }).catch(() => null); // fire-and-forget; unauthenticated users silently fail

    // Save last-read position for "Continue Reading" banner
    if (chapterNumber && verseNumber) {
      try {
        localStorage.setItem('gita_last_read', JSON.stringify({
          chapter: chapterNumber,
          verse:   verseNumber,
          title:   chapterTitle ?? '',
          ts:      Date.now(),
        }));
      } catch { /* ignore quota errors */ }
    }
  }, [verseId, chapterId, chapterNumber, verseNumber, chapterTitle]);

  return null;
}
