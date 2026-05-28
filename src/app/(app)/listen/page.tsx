'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Play, Pause, SkipBack, SkipForward, BookOpen, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHAPTER_TITLES, CHAPTER_VERSE_COUNTS } from '@/lib/audioManifest';
import Link from 'next/link';

// ── Speed cycle ──────────────────────────────────────────────────────────────
const SPEED_CYCLE = [0.75, 1, 1.25, 1.5] as const;
type Speed = (typeof SPEED_CYCLE)[number];

// ── Animated OM rings visualiser ─────────────────────────────────────────────
function OmVisualiser({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-52 h-52">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'absolute rounded-full border transition-all duration-700',
            isPlaying
              ? 'border-saffron-400/50 animate-pulse-soft'
              : 'border-saffron-600/20',
          )}
          style={{
            width:          `${i * 60}px`,
            height:         `${i * 60}px`,
            animationDelay: `${(i - 1) * 0.45}s`,
          }}
        />
      ))}
      {/* Centre OM badge */}
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-saffron-400 to-gold-600 flex items-center justify-center shadow-glow z-10 flex-shrink-0">
        <span className="font-serif text-white text-4xl select-none">ॐ</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ListenPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Current verse
  const [chapter,    setChapter]    = useState(1);
  const [verse,      setVerse]      = useState(1);

  // Verse content
  const [sanskrit,   setSanskrit]   = useState('');
  const [fetchError, setFetchError] = useState(false);
  const [fetching,   setFetching]   = useState(true);

  // Audio
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [speedIdx,   setSpeedIdx]   = useState(1);          // index into SPEED_CYCLE; default 1 = 1×
  const speed: Speed = SPEED_CYCLE[speedIdx];

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoPlayRef  = useRef(false);                        // carry intent across fetch→play

  // ── Parse URL params on mount ───────────────────────────────────────────────
  useEffect(() => {
    const ch = parseInt(searchParams.get('chapter') ?? '1');
    const v  = parseInt(searchParams.get('verse')   ?? '1');
    setChapter(isNaN(ch) || ch < 1 || ch > 18 ? 1 : ch);
    setVerse  (isNaN(v)  || v  < 1 ? 1 : v);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stop speech synthesis ───────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioState('idle');
    utteranceRef.current = null;
  }, []);

  // ── Fetch Sanskrit text whenever chapter/verse changes ──────────────────────
  useEffect(() => {
    setFetching(true);
    setFetchError(false);
    setSanskrit('');
    stopAudio();

    fetch(`/api/verses/${chapter}/${verse}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { sanskrit?: string }) => {
        setSanskrit(data.sanskrit?.trim() ?? '');
        setFetching(false);

        // If user clicked Play before the fetch completed, resume playback
        if (autoPlayRef.current) {
          autoPlayRef.current = false;
          // small delay so state settles
          setTimeout(() => triggerPlay(data.sanskrit?.trim() ?? '', speed), 80);
        }
      })
      .catch((err) => {
        console.error('Verse fetch failed:', err);
        setFetchError(true);
        setFetching(false);
        autoPlayRef.current = false;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, verse]);

  // ── Speak Sanskrit text ─────────────────────────────────────────────────────
  const triggerPlay = useCallback(
    (text: string, rate: Speed) => {
      if (!text) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.error('Web Speech API not supported in this browser');
        return;
      }

      window.speechSynthesis.cancel();
      setAudioState('loading');

      const utterance = new SpeechSynthesisUtterance(text);

      // Pick best available voice (Sanskrit > Hindi > Marathi > default)
      const voices = window.speechSynthesis.getVoices();
      const voice  =
        voices.find((v) => v.lang.startsWith('sa')) ??
        voices.find((v) => v.lang.startsWith('hi')) ??
        voices.find((v) => v.lang.startsWith('mr')) ??
        null;
      if (voice) utterance.voice = voice;
      utterance.lang  = voice?.lang ?? 'hi-IN';
      utterance.rate  = rate;
      utterance.pitch = 1.0;

      utterance.onstart = () => setAudioState('playing');

      utterance.onend = () => {
        setAudioState('idle');
        utteranceRef.current = null;
        // Auto-advance to next verse
        setChapter((ch) => {
          setVerse((v) => {
            const maxVerse = CHAPTER_VERSE_COUNTS[ch] ?? 1;
            if (v < maxVerse) {
              const next = v + 1;
              autoPlayRef.current = true;
              router.replace(`/listen?chapter=${ch}&verse=${next}`, { scroll: false });
              return next;
            }
            // End of chapter — stop
            return v;
          });
          return ch;
        });
      };

      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e.error, e);
        setAudioState('idle');
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Chrome sometimes doesn't fire onstart; treat it as playing after 350ms
      setTimeout(() => setAudioState((s) => (s === 'loading' ? 'playing' : s)), 350);
    },
    [router],
  );

  // ── Toggle play / pause ─────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (audioState === 'playing') {
      stopAudio();
    } else if (!fetching && !fetchError && sanskrit) {
      triggerPlay(sanskrit, speed);
    } else if (fetching) {
      // Will auto-play once fetch completes
      autoPlayRef.current = true;
      setAudioState('loading');
    }
  }, [audioState, fetching, fetchError, sanskrit, speed, stopAudio, triggerPlay]);

  // ── Navigate prev / next verse ──────────────────────────────────────────────
  const navigate = useCallback(
    (direction: -1 | 1) => {
      stopAudio();
      setChapter((ch) => {
        const maxVerse = CHAPTER_VERSE_COUNTS[ch] ?? 1;
        return setVerse((v) => {
          let newV  = v + direction;
          let newCh = ch;

          if (newV < 1) {
            newCh = Math.max(1, ch - 1);
            newV  = CHAPTER_VERSE_COUNTS[newCh] ?? 1;
          } else if (newV > maxVerse) {
            newCh = Math.min(18, ch + 1);
            newV  = 1;
          }

          router.replace(`/listen?chapter=${newCh}&verse=${newV}`, { scroll: false });
          // update chapter if it changed
          if (newCh !== ch) setTimeout(() => setChapter(newCh), 0);
          return newV;
        }) as unknown as number; // satisfy TS — actual return unused
      }) as unknown as number;
    },
    [stopAudio, router],
  );

  // ── Simpler navigate without functional-set nesting ─────────────────────────
  // (replaces the complicated closure above)
  const goToVerse = useCallback(
    (newCh: number, newV: number) => {
      stopAudio();
      setChapter(newCh);
      setVerse(newV);
      router.replace(`/listen?chapter=${newCh}&verse=${newV}`, { scroll: false });
    },
    [stopAudio, router],
  );

  const handlePrev = useCallback(() => {
    const maxVerse = CHAPTER_VERSE_COUNTS[chapter] ?? 1;
    let newV  = verse - 1;
    let newCh = chapter;
    if (newV < 1) {
      newCh = Math.max(1, chapter - 1);
      newV  = CHAPTER_VERSE_COUNTS[newCh] ?? 1;
    }
    void maxVerse; // used above via CHAPTER_VERSE_COUNTS
    goToVerse(newCh, newV);
  }, [chapter, verse, goToVerse]);

  const handleNext = useCallback(() => {
    const maxVerse = CHAPTER_VERSE_COUNTS[chapter] ?? 1;
    let newV  = verse + 1;
    let newCh = chapter;
    if (newV > maxVerse) {
      newCh = Math.min(18, chapter + 1);
      newV  = 1;
    }
    goToVerse(newCh, newV);
  }, [chapter, verse, goToVerse]);

  // ── Cycle playback speed ────────────────────────────────────────────────────
  const cycleSpeed = useCallback(() => {
    const nextIdx  = (speedIdx + 1) % SPEED_CYCLE.length;
    const nextRate = SPEED_CYCLE[nextIdx];
    setSpeedIdx(nextIdx);
    // If currently playing, restart at new speed
    if (audioState === 'playing' && sanskrit) {
      window.speechSynthesis.cancel();
      setTimeout(() => triggerPlay(sanskrit, nextRate), 80);
    }
  }, [speedIdx, audioState, sanskrit, triggerPlay]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => () => { stopAudio(); }, [stopAudio]);

  // ── Derived display values ──────────────────────────────────────────────────
  const chapterTitle  = CHAPTER_TITLES[chapter]  ?? `Chapter ${chapter}`;
  const isLoadingAny  = fetching || audioState === 'loading';
  const isActuallyPlaying = audioState === 'playing';

  return (
    /* h-dvh + overflow-hidden = exactly one screen, zero scroll */
    <div className="h-dvh overflow-hidden bg-gradient-to-b from-dark-950 via-dark-900 to-saffron-950/20 flex flex-col select-none">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2 flex-shrink-0">
        <Link
          href="/chapters"
          className="p-2 rounded-lg text-dark-400 hover:text-white transition-colors"
          onClick={stopAudio}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="text-center min-w-0">
          <p className="text-xs text-dark-400 uppercase tracking-widest">Now Listening</p>
          <p className="text-white/70 text-sm truncate max-w-[200px] mt-0.5">{chapterTitle}</p>
        </div>

        {/* Right spacer matches left icon width */}
        <div className="w-9 h-9" />
      </div>

      {/* ── Centre area: OM icon ── */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <OmVisualiser isPlaying={isActuallyPlaying} />
      </div>

      {/* ── Bottom stack: info + bar + controls ── */}
      <div className="flex-shrink-0 flex flex-col items-center gap-5 px-6 pb-8">

        {/* Track info */}
        <div className="text-center">
          <h1 className="font-serif text-2xl text-white">
            Chapter {chapter}, Verse {verse}
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">{chapterTitle}</p>

          {/* Status message */}
          <p className={cn(
            'text-xs mt-1.5 transition-colors',
            fetchError  ? 'text-red-400'    :
            fetching    ? 'text-dark-500'   :
            isActuallyPlaying ? 'text-saffron-400' : 'text-dark-600',
          )}>
            {fetchError        ? 'Failed to load verse — check connection'
              : fetching       ? 'Loading verse…'
              : isActuallyPlaying ? 'Reciting Sanskrit…'
              : 'Tap ▶ to recite'}
          </p>
        </div>

        {/* Progress bar — animated while playing */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full bg-gradient-to-r from-saffron-500 to-gold-400',
                isActuallyPlaying
                  ? 'transition-none w-full'
                  : 'transition-all duration-500 w-0',
              )}
              style={isActuallyPlaying ? {
                width: '100%',
                transition: 'width 60s linear',
              } : { width: '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-dark-600 mt-1.5 tabular-nums">
            <span>{isActuallyPlaying ? 'Playing' : '0:00'}</span>
            <span>Web Speech</span>
          </div>
        </div>

        {/* Main controls: Prev | Play/Pause | Next */}
        <div className="flex items-center gap-8">
          <button
            onClick={handlePrev}
            disabled={chapter === 1 && verse === 1}
            className="p-2 text-dark-300 hover:text-white transition-colors disabled:opacity-30"
            aria-label="Previous verse"
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            disabled={fetchError}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              'shadow-glow hover:scale-105 active:scale-95 transition-transform',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'bg-white text-dark-900',
            )}
            aria-label={isActuallyPlaying ? 'Pause' : 'Play'}
          >
            {isLoadingAny ? (
              <div className="w-6 h-6 border-2 border-dark-200 border-t-dark-700 rounded-full animate-spin" />
            ) : isActuallyPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={chapter === 18 && verse === (CHAPTER_VERSE_COUNTS[18] ?? 78)}
            className="p-2 text-dark-300 hover:text-white transition-colors disabled:opacity-30"
            aria-label="Next verse"
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>
        </div>

        {/* Speed tap-to-cycle */}
        <button
          onClick={cycleSpeed}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-semibold transition-all',
            'border border-dark-700 text-dark-400 hover:border-saffron-600 hover:text-saffron-400',
          )}
          aria-label={`Playback speed: ${speed}×. Tap to change.`}
        >
          {speed}×
        </button>

        {/* Read along */}
        <Link
          href={`/chapters/${chapter}/${verse}`}
          className="flex items-center gap-2 text-sm text-dark-500 hover:text-saffron-400 transition-colors"
          onClick={stopAudio}
        >
          <BookOpen className="w-4 h-4" />
          Read along
        </Link>
      </div>
    </div>
  );
}
