'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Play, Pause, SkipBack, SkipForward,
  ChevronUp, X, Volume2, VolumeX,
} from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';

// Pages where the mini player should stay hidden
const HIDDEN_PATHS = ['/', '/login', '/register', '/forgot-password'];
// Verse reader pages: /chapters/<n>/<m> — they have their own bottom nav
const isReaderRoute = (p: string) => /^\/chapters\/\d+\/\d+(\/|$)/.test(p);

export function MiniPlayer() {
  const pathname = usePathname();
  const store = useAudioStore();
  const progressRef = useRef<HTMLDivElement>(null);

  const hidden =
    !store.isMiniPlayerVisible ||
    !store.currentTrack ||
    HIDDEN_PATHS.includes(pathname) ||
    isReaderRoute(pathname) ||
    store.isFullPlayerOpen;

  // Scrub by clicking the progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    store.seek(pct * store.duration);
  };

  if (hidden) return null;

  const track = store.currentTrack!;
  const progress = store.duration > 0 ? (store.currentTime / store.duration) * 100 : 0;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/95 dark:bg-dark-900/95 backdrop-blur-md',
        'border-t border-warm-200 dark:border-dark-700',
        'shadow-large animate-slide-up',
        // Clear mobile bottom nav
        'mb-16 md:mb-0',
      )}
    >
      {/* Thin scrub bar at very top */}
      <div
        ref={progressRef}
        className="h-1 bg-warm-100 dark:bg-dark-800 cursor-pointer group"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Audio progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-saffron-500 to-gold-500 transition-all duration-300 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-saffron-500 shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center gap-3">

        {/* Track info */}
        <Link
          href="/listen"
          className="flex items-center gap-3 flex-1 min-w-0 group"
          onClick={store.openFullPlayer}
        >
          {/* Cover art placeholder */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="font-sanskrit text-white text-xs font-bold">
              {track.chapter}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-dark-900 dark:text-white truncate group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
              {track.label}
            </p>
            <p className="text-xs text-dark-400 dark:text-dark-500 truncate">
              {track.chapterTitle}
            </p>
          </div>
        </Link>

        {/* Time (desktop) */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-dark-400 dark:text-dark-500 tabular-nums flex-shrink-0">
          <span>{formatDuration(store.currentTime)}</span>
          <span>/</span>
          <span>{store.duration > 0 ? formatDuration(store.duration) : '--:--'}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={store.skipPrev}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
            aria-label="Previous verse"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={store.togglePlay}
            className="w-9 h-9 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white flex items-center justify-center transition-colors shadow-sm"
            aria-label={store.isPlaying ? 'Pause' : 'Play'}
            disabled={store.isLoading}
          >
            {store.isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : store.isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={store.skipNext}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
            aria-label="Next verse"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume toggle (desktop) */}
        <button
          onClick={store.toggleMute}
          className="hidden md:flex p-2 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors flex-shrink-0"
          aria-label={store.isMuted ? 'Unmute' : 'Mute'}
        >
          {store.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Expand / Close */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link href="/listen">
            <button
              className="p-2 rounded-lg text-dark-400 hover:text-saffron-600 dark:hover:text-saffron-400 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Open full player"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </Link>
          <button
            onClick={store.hideMiniPlayer}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
