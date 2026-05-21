'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Repeat1, Shuffle, List, ChevronDown, BookOpen,
} from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { useAudio } from '@/hooks/useAudio';
import { getChapterQueue, CHAPTER_TITLES } from '@/lib/audioManifest';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

// Animated concentric rings — visualiser placeholder
function AudioVisualiser({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'absolute rounded-full border border-saffron-300/40 dark:border-saffron-600/30 transition-all',
            isPlaying ? 'animate-pulse-soft' : 'opacity-30',
          )}
          style={{
            width:  `${i * 56}px`,
            height: `${i * 56}px`,
            animationDelay: `${(i - 1) * 0.4}s`,
          }}
        />
      ))}
      {/* Centre flame / cover art */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron-400 to-gold-600 flex items-center justify-center shadow-glow z-10">
        <span className="font-serif text-white text-3xl">ॐ</span>
      </div>
    </div>
  );
}

export default function ListenPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const audio        = useAudio();
  const store        = useAudioStore();
  const [showQueue, setShowQueue] = useState(false);

  // Initialise queue from URL params (?chapter=2&verse=47)
  useEffect(() => {
    const ch = parseInt(searchParams.get('chapter') ?? '1');
    const v  = parseInt(searchParams.get('verse')   ?? '1');
    const safeChapter = isNaN(ch) || ch < 1 || ch > 18 ? 1 : ch;
    const safeVerse   = isNaN(v)  || v  < 1 ? 1 : v;

    if (!store.currentTrack || store.currentTrack.chapter !== safeChapter) {
      const queue = getChapterQueue(safeChapter, safeVerse);
      store.setQueue(queue, 0);
      void audio.load(queue[0], false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when track changes
  useEffect(() => {
    if (!store.currentTrack) return;
    const { chapter, verse } = store.currentTrack;
    router.replace(`/listen?chapter=${chapter}&verse=${verse}`, { scroll: false });
  }, [store.currentTrack, router]);

  // Scrub
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!store.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.seek(((e.clientX - rect.left) / rect.width) * store.duration);
  };

  const progress = store.duration > 0 ? (store.currentTime / store.duration) * 100 : 0;
  const track    = store.currentTrack;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-saffron-950/20 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 pt-6 pb-2">
        <Link href="/chapters" className="p-2 rounded-lg text-dark-400 hover:text-white transition-colors">
          <ChevronDown className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <p className="text-xs text-dark-400 uppercase tracking-widest">Now Listening</p>
          <p className="text-white/70 text-sm truncate max-w-[200px]">
            {track ? CHAPTER_TITLES[track.chapter] : 'Bhagavad Gita'}
          </p>
        </div>
        <button
          onClick={() => setShowQueue((q) => !q)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            showQueue ? 'text-saffron-400 bg-saffron-900/30' : 'text-dark-400 hover:text-white',
          )}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-8">

        {/* Visualiser */}
        <AudioVisualiser isPlaying={store.isPlaying} />

        {/* Track info */}
        <div className="text-center">
          <h1 className="font-serif text-2xl sm:text-3xl text-white mb-1">
            {track ? track.label : 'Select a verse'}
          </h1>
          <p className="text-dark-400 text-sm">
            {track ? CHAPTER_TITLES[track.chapter] : ''}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div
            className="h-1.5 bg-dark-700 rounded-full cursor-pointer group"
            onClick={handleScrub}
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gradient-to-r from-saffron-500 to-gold-400 rounded-full relative transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-dark-500 mt-1.5 tabular-nums">
            <span>{formatDuration(store.currentTime)}</span>
            <span>{store.duration > 0 ? formatDuration(store.duration) : '--:--'}</span>
          </div>
        </div>

        {/* Primary controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={store.toggleShuffle}
            className={cn('p-2 transition-colors', store.isShuffled ? 'text-saffron-400' : 'text-dark-500 hover:text-dark-300')}
            aria-label="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={store.skipPrev}
            className="p-2 text-dark-300 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={store.togglePlay}
            disabled={store.isLoading}
            className="w-16 h-16 rounded-full bg-white text-dark-900 flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
            aria-label={store.isPlaying ? 'Pause' : 'Play'}
          >
            {store.isLoading ? (
              <div className="w-6 h-6 border-2 border-dark-400 border-t-dark-900 rounded-full animate-spin" />
            ) : store.isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={store.skipNext}
            className="p-2 text-dark-300 hover:text-white transition-colors"
            aria-label="Next"
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={() => store.setRepeatMode(
              store.repeatMode === 'none' ? 'all' : store.repeatMode === 'all' ? 'one' : 'none'
            )}
            className={cn('p-2 transition-colors', store.repeatMode !== 'none' ? 'text-saffron-400' : 'text-dark-500 hover:text-dark-300')}
            aria-label="Repeat"
          >
            {store.repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Secondary controls */}
        <div className="flex items-center gap-6 w-full max-w-sm">
          {/* Volume */}
          <button onClick={store.toggleMute} className="text-dark-400 hover:text-white transition-colors flex-shrink-0">
            {store.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range" min={0} max={1} step={0.05}
            value={store.isMuted ? 0 : store.volume}
            onChange={(e) => store.setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-saffron-500 h-1"
            aria-label="Volume"
          />

          {/* Speed */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {SPEED_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => store.setPlaybackRate(r)}
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium transition-colors',
                  store.playbackRate === r
                    ? 'bg-saffron-500 text-white'
                    : 'text-dark-400 hover:text-white',
                )}
              >
                {r}×
              </button>
            ))}
          </div>
        </div>

        {/* Read along link */}
        {track && (
          <Link
            href={`/chapters/${track.chapter}/${track.verse}`}
            className="flex items-center gap-2 text-sm text-dark-400 hover:text-saffron-400 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Read along
          </Link>
        )}
      </div>

      {/* Queue panel */}
      {showQueue && (
        <div className="border-t border-dark-800 bg-dark-950/80 backdrop-blur-sm px-4 py-4 max-h-72 overflow-y-auto">
          <p className="text-xs text-dark-500 uppercase tracking-widest mb-3 px-2">Up Next</p>
          <div className="space-y-1">
            {store.queue.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { store.setQueue(store.queue, i); void audio.load(t); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                  i === store.queueIndex
                    ? 'bg-saffron-900/40 text-saffron-300'
                    : 'text-dark-400 hover:bg-dark-800 hover:text-white',
                )}
              >
                <span className="text-xs tabular-nums w-6 text-right flex-shrink-0">
                  {i === store.queueIndex && store.isPlaying ? '▶' : t.verse}
                </span>
                <span className="text-sm truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
