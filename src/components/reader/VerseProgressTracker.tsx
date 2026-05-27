'use client';

import { useEffect } from 'react';

interface VerseProgressTrackerProps {
  verseId:   string;
  chapterId: string;
}

/**
 * Invisible component — fires POST /api/progress once when a verse is viewed.
 * Keeps the verse page itself as a pure server component.
 */
export function VerseProgressTracker({ verseId, chapterId }: VerseProgressTrackerProps) {
  useEffect(() => {
    fetch('/api/progress', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ verseId, chapterId }),
    }).catch(() => null); // fire-and-forget; unauthenticated users silently fail
  }, [verseId, chapterId]);

  return null;
}
