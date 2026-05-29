'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Volume2, Play, Pause, Square, ChevronDown, ChevronUp, Eye, EyeOff, Loader2, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton';
import { ShareButton } from '@/components/reader/ShareButton';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';
import { useToast } from '@/components/ui/Toast/Toast';

interface WordMeaning { word: string; meaning: string; }

interface VerseDisplayProps {
  chapter: number;
  verse: number;
  verseId?: string;
  chapterId?: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  commentary?: string;
  wordByWord?: WordMeaning[];
  // Pre-generated audio URLs from Supabase Storage
  audioSanskrit?: string | null;
  audioTranslation?: string | null;
  audioCommentary?: string | null;
}

type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused';
type AudioMode   = 'sanskrit' | 'translation' | 'full';
type ReadSection = 'sanskrit' | 'translation' | 'commentary';

// ─── Sequence definition ──────────────────────────────────────────────────────
interface SeqStep { section: ReadSection; url: string; label: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function VerseDisplay({
  chapter, verse, verseId, chapterId,
  sanskrit, transliteration, translation, commentary, wordByWord,
  audioSanskrit, audioTranslation, audioCommentary,
}: VerseDisplayProps) {
  const { toast } = useToast();

  // UI state
  const [showTranslit,     setShowTranslit]     = useState(true);
  const [commentaryOpen,   setCommentaryOpen]   = useState(false);
  const [wordMeaningsOpen, setWordMeaningsOpen] = useState(false);

  // Audio state
  const [audioStatus,    setAudioStatus]    = useState<AudioStatus>('idle');
  const [audioMode,      setAudioMode]      = useState<AudioMode>('sanskrit');
  const [audioSpeed,     setAudioSpeed]     = useState<0.75 | 1 | 1.5>(1);
  const [currentSection, setCurrentSection] = useState<ReadSection | null>(null);
  const [currentTime,    setCurrentTime]    = useState(0);
  const [duration,       setDuration]       = useState(0);

  // HTML5 Audio ref — single element, we swap src between sequence steps
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const seqRef     = useRef<SeqStep[]>([]);
  const seqIdxRef  = useRef(0);
  const mountedRef = useRef(true);

  // Check which audio URLs are available
  const hasAudio = !!(audioSanskrit || audioTranslation || audioCommentary);

  // Word map for transliteration tooltips
  const wordMap = useMemo(() => {
    const m = new Map<string, string>();
    wordByWord?.forEach(({ word, meaning }) =>
      m.set(word.toLowerCase().replace(/[^a-z]/g, ''), meaning));
    return m;
  }, [wordByWord]);

  // ── Audio element setup ───────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onLoadStart  = () => { if (mountedRef.current) setAudioStatus('loading'); };
    const onCanPlay    = () => { if (mountedRef.current) setAudioStatus(s => s === 'loading' ? 'playing' : s); };
    const onPlay       = () => { if (mountedRef.current) setAudioStatus('playing'); };
    const onPause      = () => { if (mountedRef.current && audio.currentTime < audio.duration - 0.1) setAudioStatus('paused'); };
    const onTimeUpdate = () => { if (mountedRef.current) setCurrentTime(audio.currentTime); };
    const onDurationChange = () => { if (mountedRef.current) setDuration(audio.duration); };
    const onError      = () => {
      if (!mountedRef.current) return;
      toast({ message: 'Could not load audio', variant: 'error' });
      setAudioStatus('idle');
      setCurrentSection(null);
    };
    const onEnded = () => {
      if (!mountedRef.current) return;
      // Advance to next step in sequence
      const nextIdx = seqIdxRef.current + 1;
      if (nextIdx < seqRef.current.length) {
        seqIdxRef.current = nextIdx;
        const next = seqRef.current[nextIdx];
        setCurrentSection(next.section);
        if (next.section === 'commentary') setCommentaryOpen(true);
        audio.src = next.url;
        audio.playbackRate = audioRef.current?.playbackRate ?? 1;
        audio.play().catch(() => {});
      } else {
        // Sequence complete
        setAudioStatus('idle');
        setCurrentSection(null);
        setCurrentTime(0);
        setDuration(0);
      }
    };

    audio.addEventListener('loadstart',      onLoadStart);
    audio.addEventListener('canplay',        onCanPlay);
    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('timeupdate',     onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('error',         onError);
    audio.addEventListener('ended',          onEnded);

    return () => {
      mountedRef.current = false;
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadstart',      onLoadStart);
      audio.removeEventListener('canplay',        onCanPlay);
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('timeupdate',     onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('error',         onError);
      audio.removeEventListener('ended',          onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open commentary when it starts playing
  useEffect(() => {
    if (currentSection === 'commentary') setCommentaryOpen(true);
  }, [currentSection]);

  // ── Build sequence based on mode ──────────────────────────────────────────
  const buildSequence = useCallback((mode: AudioMode): SeqStep[] => {
    const steps: SeqStep[] = [];
    if ((mode === 'sanskrit' || mode === 'full') && audioSanskrit) {
      steps.push({ section: 'sanskrit',    url: audioSanskrit,    label: 'Sanskrit verse' });
    }
    if ((mode === 'translation' || mode === 'full') && audioTranslation) {
      steps.push({ section: 'translation', url: audioTranslation, label: 'Translation' });
    }
    if (mode === 'full' && audioCommentary) {
      steps.push({ section: 'commentary',  url: audioCommentary,  label: 'Commentary' });
    }
    return steps;
  }, [audioSanskrit, audioTranslation, audioCommentary]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const handlePlay = useCallback((modeOverride?: AudioMode) => {
    const mode = modeOverride ?? audioMode;
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasAudio) {
      toast({ message: 'Audio not yet generated for this verse. Run the generation script first.', variant: 'warning' });
      return;
    }

    const seq = buildSequence(mode);
    if (seq.length === 0) {
      toast({ message: 'No audio available for this selection', variant: 'warning' });
      return;
    }

    seqRef.current  = seq;
    seqIdxRef.current = 0;
    const first = seq[0];
    setCurrentSection(first.section);
    if (first.section === 'commentary') setCommentaryOpen(true);
    audio.src = first.url;
    audio.playbackRate = audioSpeed;
    audio.currentTime = 0;
    audio.play().catch(() => {
      toast({ message: 'Playback blocked — tap Play again', variant: 'warning' });
    });
  }, [audioMode, audioSpeed, buildSequence, hasAudio, toast]);

  const handlePause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const handleStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
    seqRef.current = [];
    seqIdxRef.current = 0;
    setAudioStatus('idle');
    setCurrentSection(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const handleSkip = useCallback(() => {
    const nextIdx = seqIdxRef.current + 1;
    const audio = audioRef.current;
    if (!audio || nextIdx >= seqRef.current.length) { handleStop(); return; }
    seqIdxRef.current = nextIdx;
    const next = seqRef.current[nextIdx];
    setCurrentSection(next.section);
    audio.src = next.url;
    audio.playbackRate = audioSpeed;
    audio.play().catch(() => {});
  }, [audioSpeed, handleStop]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
  }, []);

  const handleSpeedChange = useCallback((spd: 0.75 | 1 | 1.5) => {
    setAudioSpeed(spd);
    if (audioRef.current) audioRef.current.playbackRate = spd;
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const isIdle    = audioStatus === 'idle';
  const isLoading = audioStatus === 'loading';
  const isPlaying = audioStatus === 'playing';
  const isPaused  = audioStatus === 'paused';

  const SECTION_LABEL: Record<ReadSection, string> = {
    sanskrit:    'Sanskrit verse',
    translation: 'Translation',
    commentary:  'Commentary',
  };

  // ── Transliteration with tooltips ─────────────────────────────────────────
  function renderTranslitLine(line: string): React.ReactNode {
    if (!wordByWord?.length) return line;
    return line.split(/(\s+)/).map((tok, i) => {
      if (/^\s+$/.test(tok)) return tok;
      const clean   = tok.toLowerCase().replace(/[^a-z]/g, '');
      const meaning = wordMap.get(clean);
      if (!meaning) return <span key={i}>{tok}</span>;
      return (
        <Tooltip
          key={i}
          content={<><span className="font-medium">{tok}</span><br />{meaning}</>}
          placement="top"
        >
          <span className="cursor-help underline decoration-dotted decoration-saffron-400 underline-offset-2 hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors">
            {tok}
          </span>
        </Tooltip>
      );
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <article className="space-y-8 animate-fade-in">

      {/* ── Verse header divider ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-warm-200 dark:to-dark-700" />
        <span className="text-xs font-semibold text-saffron-500 dark:text-saffron-400 uppercase tracking-widest px-2">
          Chapter {chapter} · Verse {verse}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-warm-200 dark:to-dark-700" />
      </div>

      {/* ── Sanskrit section ── */}
      <section aria-label="Sanskrit verse">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest">
            Sanskrit
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslit(v => !v)}
              className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
              aria-label={showTranslit ? 'Hide transliteration' : 'Show transliteration'}
            >
              {showTranslit ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showTranslit ? 'Hide' : 'Show'} transliteration
            </button>

            {/* Quick listen shortcut */}
            <button
              onClick={() => isIdle ? handlePlay('sanskrit') : handleStop()}
              className="flex items-center gap-1 text-xs text-saffron-600 dark:text-saffron-400 hover:text-saffron-700 transition-colors"
              aria-label={isIdle ? 'Listen' : 'Stop'}
            >
              {isLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : !isIdle
                ? <Square className="w-3.5 h-3.5 fill-current" />
                : <Volume2 className="w-3.5 h-3.5" />}
              {isLoading ? 'Loading…' : !isIdle ? 'Stop' : 'Listen'}
            </button>

            {verseId && chapterId && (
              <BookmarkButton verseId={verseId} chapterId={chapterId} size="sm" />
            )}
            <ShareButton chapter={chapter} verse={verse} sanskrit={sanskrit} translation={translation} />
          </div>
        </div>

        <div className={cn(
          'bg-gradient-to-br from-warm-50 to-saffron-50/30 dark:from-dark-800 dark:to-dark-800/50 rounded-2xl p-6 sm:p-8 border transition-colors duration-300',
          currentSection === 'sanskrit' && !isIdle
            ? 'border-saffron-400 dark:border-saffron-600 shadow-sm'
            : 'border-warm-200 dark:border-dark-700',
        )}>
          <p className="font-sanskrit text-xl sm:text-2xl md:text-3xl text-dark-900 dark:text-white leading-loose text-center whitespace-pre-line">
            {sanskrit}
          </p>

          {showTranslit && (
            <p className="mt-4 text-sm text-dark-500 dark:text-dark-400 italic text-center leading-relaxed">
              {transliteration.split('\n').map((line, i) => (
                <span key={i} className="block">{renderTranslitLine(line)}</span>
              ))}
            </p>
          )}
        </div>
      </section>

      {/* ── Word meanings ── */}
      {wordByWord && wordByWord.length > 0 && (
        <section aria-label="Word meanings">
          <button
            onClick={() => setWordMeaningsOpen(o => !o)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-warm-50 dark:bg-dark-800 border border-warm-200 dark:border-dark-700 hover:border-saffron-300 dark:hover:border-saffron-700 transition-colors group"
            aria-expanded={wordMeaningsOpen}
          >
            <span className="text-sm font-semibold text-dark-700 dark:text-dark-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
              Word meanings
            </span>
            {wordMeaningsOpen
              ? <ChevronUp className="w-4 h-4 text-dark-400" />
              : <ChevronDown className="w-4 h-4 text-dark-400" />}
          </button>
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            wordMeaningsOpen ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0',
          )}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-1 py-2">
              {wordByWord.map(({ word, meaning }, i) => (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium text-saffron-700 dark:text-saffron-400 shrink-0">{word}</span>
                  <span className="text-dark-400 dark:text-dark-500 shrink-0">—</span>
                  <span className="text-dark-600 dark:text-dark-300">{meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Translation ── */}
      <section aria-label="Translation">
        <h2 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-4">
          Translation
        </h2>
        <blockquote className={cn(
          'border-l-4 pl-6 py-2 transition-colors duration-300',
          currentSection === 'translation' && !isIdle
            ? 'border-saffron-400 dark:border-saffron-500'
            : 'border-saffron-400 dark:border-saffron-600',
        )}>
          <p className="text-dark-800 dark:text-dark-100 text-lg leading-relaxed font-serif">
            &ldquo;{translation}&rdquo;
          </p>
          <footer className="mt-3 text-sm text-dark-400 dark:text-dark-500">
            &mdash; Swami Sivananda, <cite>The Bhagavad Gita</cite> (Divine Life Society)
          </footer>
        </blockquote>
      </section>

      {/* ── Commentary ── */}
      {commentary && (
        <section aria-label="Commentary">
          <button
            onClick={() => setCommentaryOpen(o => !o)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-warm-50 dark:bg-dark-800 border border-warm-200 dark:border-dark-700 hover:border-saffron-300 dark:hover:border-saffron-700 transition-colors group"
            aria-expanded={commentaryOpen}
          >
            <span className={cn(
              'text-sm font-semibold transition-colors',
              currentSection === 'commentary' && !isIdle
                ? 'text-saffron-600 dark:text-saffron-400'
                : 'text-dark-700 dark:text-dark-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400',
            )}>
              Commentary
              {currentSection === 'commentary' && !isIdle && (
                <span className="ml-2 text-xs font-normal animate-pulse">▶ playing</span>
              )}
            </span>
            {commentaryOpen
              ? <ChevronUp className="w-4 h-4 text-dark-400" />
              : <ChevronDown className="w-4 h-4 text-dark-400" />}
          </button>
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            commentaryOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0',
          )}>
            <div className="px-4 py-2 space-y-3">
              {commentary.split('\n\n').map((para, i) => (
                <p key={i} className="text-dark-600 dark:text-dark-300 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Audio Player ── */}
      <section aria-label="Audio recitation" className="rounded-2xl border border-warm-200 dark:border-dark-700 bg-white dark:bg-dark-800 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 px-4 pt-3.5 pb-3 border-b border-warm-100 dark:border-dark-700">
          <Volume2 className="w-4 h-4 text-saffron-500 shrink-0" />
          <span className="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-widest flex-1">
            Audio Recitation
          </span>
          {!isIdle && currentSection && (
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              isPaused
                ? 'bg-dark-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400'
                : 'bg-saffron-50 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-400',
            )}>
              {isPaused ? '⏸' : isLoading ? '⌛' : '▶'} {SECTION_LABEL[currentSection]}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">

          {/* Mode selector — only shown when idle */}
          {isIdle && (
            <div className="flex gap-1.5">
              {([
                { id: 'sanskrit'    as AudioMode, label: 'Sanskrit',     available: !!audioSanskrit },
                { id: 'translation' as AudioMode, label: 'Translation',  available: !!audioTranslation },
                { id: 'full'        as AudioMode, label: 'Full reading', available: !!(audioSanskrit || audioTranslation || audioCommentary) },
              ]).map(({ id, label, available }) => (
                <button
                  key={id}
                  onClick={() => setAudioMode(id)}
                  disabled={!available}
                  title={available ? undefined : 'Audio not yet generated'}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    audioMode === id && available
                      ? 'bg-saffron-500 text-white border-saffron-500'
                      : available
                      ? 'border-warm-200 dark:border-dark-700 text-dark-500 dark:text-dark-400 hover:border-saffron-300 dark:hover:border-saffron-600'
                      : 'border-warm-200 dark:border-dark-700 text-dark-300 dark:text-dark-600 cursor-not-allowed opacity-50',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Progress bar — shown while playing/paused */}
          {!isIdle && (
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 accent-saffron-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-dark-400 dark:text-dark-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">

            {isIdle && (
              <button
                onClick={() => handlePlay()}
                disabled={!hasAudio}
                title={hasAudio ? undefined : 'Audio not yet generated for this verse'}
                className={cn(
                  'flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-semibold transition-all',
                  hasAudio
                    ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:shadow-glow hover:-translate-y-0.5'
                    : 'bg-warm-100 dark:bg-dark-700 text-dark-400 dark:text-dark-500 cursor-not-allowed',
                )}
              >
                <Play className="w-4 h-4 fill-current" />
                {hasAudio ? 'Play' : 'Audio coming soon'}
              </button>
            )}

            {isLoading && (
              <button disabled className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-semibold bg-saffron-50 dark:bg-saffron-900/20 text-saffron-600 dark:text-saffron-400 cursor-not-allowed">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </button>
            )}

            {isPlaying && (
              <>
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-semibold bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-200 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                >
                  <Pause className="w-4 h-4 fill-current" /> Pause
                </button>
                {seqRef.current.length > 1 && (
                  <button
                    onClick={handleSkip}
                    className="p-2.5 rounded-xl border border-warm-200 dark:border-dark-600 text-dark-400 hover:border-saffron-300 hover:text-saffron-500 transition-colors"
                    aria-label="Skip to next section"
                    title="Skip to next section"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="p-2.5 rounded-xl border border-warm-200 dark:border-dark-600 text-dark-400 hover:border-red-300 hover:text-red-500 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
                  aria-label="Stop"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </>
            )}

            {isPaused && (
              <>
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:shadow-glow transition-all"
                >
                  <Play className="w-4 h-4 fill-current" /> Resume
                </button>
                <button
                  onClick={handleStop}
                  className="p-2.5 rounded-xl border border-warm-200 dark:border-dark-600 text-dark-400 hover:border-red-300 hover:text-red-500 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
                  aria-label="Stop"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </>
            )}

            {/* Speed selector */}
            <div className={cn(
              'flex items-center rounded-lg border border-warm-200 dark:border-dark-700 overflow-hidden text-xs font-medium',
              isIdle ? 'ml-auto' : '',
            )}>
              {([0.75, 1, 1.5] as const).map(spd => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={cn(
                    'px-2.5 py-1.5 transition-colors',
                    audioSpeed === spd
                      ? 'bg-saffron-500 text-white'
                      : 'text-dark-400 dark:text-dark-400 hover:bg-warm-100 dark:hover:bg-dark-700',
                  )}
                >
                  {spd}×
                </button>
              ))}
            </div>
          </div>

          {/* Full reading note */}
          {audioMode === 'full' && isIdle && hasAudio && (
            <p className="text-xs text-dark-400 dark:text-dark-500 text-center">
              Plays Sanskrit → Translation{audioCommentary ? ' → Commentary' : ''} in sequence
            </p>
          )}

          {!hasAudio && (
            <p className="text-xs text-dark-400 dark:text-dark-500 text-center">
              Audio files are being generated — check back soon
            </p>
          )}
        </div>
      </section>

      {/* ── Reflect ── */}
      <section className="bg-gradient-to-br from-spiritual-100 to-saffron-50 dark:from-spiritual-900/20 dark:to-saffron-900/10 rounded-2xl p-6 border border-spiritual-200 dark:border-spiritual-800/50">
        <p className="text-xs font-semibold text-spiritual-600 dark:text-spiritual-400 uppercase tracking-widest mb-2">
          Reflect
        </p>
        <p className="text-dark-700 dark:text-dark-200 text-sm leading-relaxed">
          How does this verse speak to something you are navigating in your life right now? Sit with it for a moment before moving on.
        </p>
      </section>

    </article>
  );
}
