'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Repeat1, Shuffle, List, BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useAudioStore } from '@/stores/audioStore';
import { CHAPTER_TITLES } from '@/lib/audioManifest';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { QueuePanel } from './QueuePanel';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export function FullPlayerSheet() {
  const store     = useAudioStore();
  const sheetRef  = useRef<HTMLDivElement>(null);
  const startY    = useRef<number | null>(null);
  const currentY  = useRef(0);

  // Drag-to-dismiss on mobile
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && sheetRef.current) {
      currentY.current = dy;
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (currentY.current > 100) {
      store.closeFullPlayer();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
    startY.current = null;
    currentY.current = 0;
  }, [store]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') store.closeFullPlayer(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [store]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = store.isFullPlayerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [store.isFullPlayerOpen]);

  if (!store.isFullPlayerOpen || !store.currentTrack) return null;

  const track    = store.currentTrack;
  const progress = store.duration > 0 ? (store.currentTime / store.duration) * 100 : 0;

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!store.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    store.seek(((e.clientX - rect.left) / rect.width) * store.duration);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={store.closeFullPlayer}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex flex-col',
          'bg-gradient-to-b from-dark-900 to-dark-950',
          'rounded-t-3xl shadow-large',
          'animate-slide-up',
          'h-[92dvh] sm:h-[85dvh]',
          'transition-transform duration-200',
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-dark-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <button
            onClick={store.closeFullPlayer}
            className="p-2 rounded-xl text-dark-400 hover:text-white transition-colors"
            aria-label="Close player"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-dark-400 uppercase tracking-widest">Now Playing</p>
          </div>
          <Link
            href={`/chapters/${track.chapter}/${track.verse}`}
            onClick={store.closeFullPlayer}
            className="p-2 rounded-xl text-dark-400 hover:text-saffron-400 transition-colors"
            aria-label="Read along"
          >
            <BookOpen className="w-5 h-5" />
          </Link>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Cover art */}
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-saffron-400 via-saffron-500 to-gold-600 flex items-center justify-center shadow-glow">
                <span className="font-serif text-white text-6xl">ॐ</span>
              </div>
            </div>

            {/* Track info */}
            <div className="text-center">
              <h2 className="font-serif text-2xl text-white">{track.label}</h2>
              <p className="text-dark-400 text-sm mt-1">{CHAPTER_TITLES[track.chapter]}</p>
            </div>

            {/* Progress */}
            <div>
              <div
                className="h-2 bg-dark-700 rounded-full cursor-pointer group"
                onClick={handleScrub}
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-gradient-to-r from-saffron-500 to-gold-400 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 -translate-x-1/2 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-dark-500 mt-1.5 tabular-nums">
                <span>{formatDuration(store.currentTime)}</span>
                <span>{formatDuration(store.duration)}</span>
              </div>
            </div>

            {/* Primary controls */}
            <div className="flex items-center justify-center gap-7">
              <button
                onClick={store.toggleShuffle}
                className={cn('p-2 transition-colors', store.isShuffled ? 'text-saffron-400' : 'text-dark-500 hover:text-dark-300')}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={store.skipPrev} className="p-2 text-dark-300 hover:text-white transition-colors">
                <SkipBack className="w-7 h-7" fill="currentColor" />
              </button>
              <button
                onClick={store.togglePlay}
                disabled={store.isLoading}
                className="w-16 h-16 rounded-full bg-white text-dark-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-glow disabled:opacity-60"
              >
                {store.isLoading
                  ? <div className="w-6 h-6 border-2 border-dark-300 border-t-dark-900 rounded-full animate-spin" />
                  : store.isPlaying
                  ? <Pause className="w-7 h-7" fill="currentColor" />
                  : <Play  className="w-7 h-7 ml-1" fill="currentColor" />
                }
              </button>
              <button onClick={store.skipNext} className="p-2 text-dark-300 hover:text-white transition-colors">
                <SkipForward className="w-7 h-7" fill="currentColor" />
              </button>
              <button
                onClick={() => store.setRepeatMode(
                  store.repeatMode === 'none' ? 'all' : store.repeatMode === 'all' ? 'one' : 'none',
                )}
                className={cn('p-2 transition-colors', store.repeatMode !== 'none' ? 'text-saffron-400' : 'text-dark-500 hover:text-dark-300')}
              >
                {store.repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Volume + speed */}
            <div className="flex items-center gap-3">
              <button onClick={store.toggleMute} className="text-dark-400 hover:text-white transition-colors flex-shrink-0">
                {store.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.05}
                value={store.isMuted ? 0 : store.volume}
                onChange={(e) => store.setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-saffron-500"
                aria-label="Volume"
              />
            </div>

            {/* Speed */}
            <div className="flex items-center justify-center gap-2">
              {SPEED_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => store.setPlaybackRate(r)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    store.playbackRate === r
                      ? 'bg-saffron-500 text-white shadow-sm'
                      : 'bg-dark-800 text-dark-400 hover:text-white',
                  )}
                >
                  {r}×
                </button>
              ))}
            </div>

            {/* Queue */}
            <div className="border-t border-dark-800 pt-4">
              <div className="flex items-center gap-2 mb-3 px-0">
                <List className="w-4 h-4 text-dark-500" />
                <span className="text-sm font-medium text-dark-300">Queue</span>
              </div>
              <QueuePanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
