'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Volume2, Play, Pause, Square, ChevronDown, ChevronUp, Eye, EyeOff, Loader2 } from 'lucide-react';
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
}

type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused';
type AudioMode   = 'sanskrit' | 'translation' | 'full';
type ReadSection = 'sanskrit' | 'translation' | 'commentary';

// ── Text tokeniser for per-word highlight ─────────────────────────────────────
interface Token { text: string; start: number; isWord: boolean; }
function tokenize(text: string): Token[] {
  const toks: Token[] = [];
  const re = /\S+|\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    toks.push({ text: m[0], start: m.index, isWord: /\S/.test(m[0]) });
  }
  return toks;
}

// ── Inline highlighted text renderer ─────────────────────────────────────────
function HighlightedText({
  text, charIdx, active, className,
}: { text: string; charIdx: number; active: boolean; className?: string }) {
  const tokens = useMemo(() => tokenize(text), [text]);

  if (!active || charIdx < 0) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        const hit = tok.isWord && charIdx >= tok.start && charIdx < tok.start + tok.text.length;
        return hit ? (
          <mark key={i} className="bg-saffron-200 dark:bg-saffron-800/80 text-dark-900 dark:text-white rounded-sm not-italic">
            {tok.text}
          </mark>
        ) : <span key={i}>{tok.text}</span>;
      })}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function VerseDisplay({
  chapter, verse, verseId, chapterId,
  sanskrit, transliteration, translation, commentary, wordByWord,
}: VerseDisplayProps) {
  const { toast } = useToast();

  // UI state
  const [showTranslit,     setShowTranslit]     = useState(true);
  const [commentaryOpen,   setCommentaryOpen]   = useState(false);
  const [wordMeaningsOpen, setWordMeaningsOpen] = useState(false);

  // Audio state
  const [audioStatus,      setAudioStatus]      = useState<AudioStatus>('idle');
  const [audioMode,        setAudioMode]        = useState<AudioMode>('sanskrit');
  const [audioSpeed,       setAudioSpeed]       = useState<0.75 | 1 | 1.5>(1);
  const [highlightCharIdx, setHighlightCharIdx] = useState(-1);
  const [highlightSection, setHighlightSection] = useState<ReadSection | null>(null);

  // Stable refs (avoid stale closures in async callbacks)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sequenceRef  = useRef<Array<{ text: string; section: ReadSection }>>([]);
  const seqIdxRef    = useRef(0);
  const speedRef     = useRef<number>(audioSpeed);
  const mountedRef   = useRef(true);
  speedRef.current   = audioSpeed;

  // Word map for transliteration hover tooltips
  const wordMap = useMemo(() => {
    const m = new Map<string, string>();
    wordByWord?.forEach(({ word, meaning }) =>
      m.set(word.toLowerCase().replace(/[^a-z]/g, ''), meaning));
    return m;
  }, [wordByWord]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Auto-open commentary accordion when it starts being read aloud
  useEffect(() => {
    if (highlightSection === 'commentary') setCommentaryOpen(true);
  }, [highlightSection]);

  // ── Core speak function ───────────────────────────────────────────────────
  const speakText = useCallback((
    text: string,
    section: ReadSection,
    rate: number,
    onDone: () => void,
  ) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setHighlightSection(section);
    setHighlightCharIdx(-1);
    setAudioStatus('loading');

    const u = new SpeechSynthesisUtterance(text);
    const voices     = window.speechSynthesis.getVoices();
    const isSanskrit = section === 'sanskrit';

    const voice = isSanskrit
      ? (voices.find(v => v.lang.startsWith('sa'))
          ?? voices.find(v => v.lang.startsWith('hi'))
          ?? voices.find(v => v.lang.startsWith('mr'))
          ?? null)
      : (voices.find(v => v.lang.startsWith('en')) ?? null);

    if (voice) u.voice = voice;
    u.lang  = voice?.lang ?? (isSanskrit ? 'hi-IN' : 'en-US');
    u.rate  = rate;
    u.pitch = 1.0;

    u.onstart = () => { if (mountedRef.current) setAudioStatus('playing'); };

    // onboundary fires at each word boundary — use requestAnimationFrame to
    // throttle React re-renders to display frames.
    u.onboundary = (e) => {
      if (e.name === 'word' && mountedRef.current) {
        requestAnimationFrame(() => setHighlightCharIdx(e.charIndex));
      }
    };

    u.onend = () => {
      if (!mountedRef.current) return;
      setHighlightCharIdx(-1);
      onDone();
    };

    u.onerror = (e) => {
      if (!mountedRef.current) return;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        toast({ message: 'Playback error — try again', variant: 'error' });
      }
      setAudioStatus('idle');
      setHighlightSection(null);
      setHighlightCharIdx(-1);
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    // Chrome sometimes doesn't fire onstart — treat as playing after 400ms
    setTimeout(() => {
      if (mountedRef.current) setAudioStatus(s => s === 'loading' ? 'playing' : s);
    }, 400);
  }, [toast]);

  // ── Sequence player (chains multiple sections for Full mode) ──────────────
  const playStep = useCallback((idx: number) => {
    const seq = sequenceRef.current;
    if (idx >= seq.length) {
      if (mountedRef.current) {
        setAudioStatus('idle');
        setHighlightSection(null);
        setHighlightCharIdx(-1);
      }
      return;
    }
    speakText(seq[idx].text, seq[idx].section, speedRef.current, () => {
      seqIdxRef.current = idx + 1;
      // Small pause (700ms) between sections
      setTimeout(() => { if (mountedRef.current) playStep(idx + 1); }, 700);
    });
  }, [speakText]);

  // ── Public controls ───────────────────────────────────────────────────────
  const handlePlay = useCallback((modeOverride?: AudioMode) => {
    if (!('speechSynthesis' in window)) {
      toast({ message: 'Audio not supported in this browser', variant: 'warning' });
      return;
    }
    const mode = modeOverride ?? audioMode;
    if (mode === 'sanskrit') {
      sequenceRef.current = [{ text: sanskrit, section: 'sanskrit' }];
    } else if (mode === 'translation') {
      sequenceRef.current = [{ text: translation, section: 'translation' }];
    } else {
      // Full: Sanskrit → Translation → Commentary (if exists)
      sequenceRef.current = [
        { text: sanskrit,    section: 'sanskrit'    },
        { text: translation, section: 'translation' },
        ...(commentary ? [{ text: commentary, section: 'commentary' as ReadSection }] : []),
      ];
    }
    seqIdxRef.current = 0;
    playStep(0);
  }, [audioMode, sanskrit, translation, commentary, playStep, toast]);

  const handlePause = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setAudioStatus('paused');
    }
  }, []);

  const handleResume = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setAudioStatus('playing');
    }
  }, []);

  const handleStop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioStatus('idle');
    setHighlightSection(null);
    setHighlightCharIdx(-1);
    sequenceRef.current = [];
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

  // ── Transliteration with word tooltips ────────────────────────────────────
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

            {/* Quick listen shortcut → plays Sanskrit, or stops if already going */}
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

        <div className="bg-gradient-to-br from-warm-50 to-saffron-50/30 dark:from-dark-800 dark:to-dark-800/50 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-dark-700">
          {/* Sanskrit text — highlighted word-by-word while speaking */}
          <p className="font-sanskrit text-xl sm:text-2xl md:text-3xl text-dark-900 dark:text-white leading-loose text-center whitespace-pre-line">
            <HighlightedText
              text={sanskrit}
              charIdx={highlightCharIdx}
              active={highlightSection === 'sanskrit'}
            />
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
        <blockquote className="border-l-4 border-saffron-400 dark:border-saffron-600 pl-6 py-2">
          <p className="text-dark-800 dark:text-dark-100 text-lg leading-relaxed font-serif">
            &ldquo;<HighlightedText
              text={translation}
              charIdx={highlightCharIdx}
              active={highlightSection === 'translation'}
            />&rdquo;
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
            <span className="text-sm font-semibold text-dark-700 dark:text-dark-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
              Commentary
            </span>
            {commentaryOpen
              ? <ChevronUp className="w-4 h-4 text-dark-400" />
              : <ChevronDown className="w-4 h-4 text-dark-400" />}
          </button>
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            commentaryOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0',
          )}>
            <div className="px-4 py-2">
              {highlightSection === 'commentary' ? (
                /*
                 * While reading commentary, render as a SINGLE block so that
                 * charIndex from onboundary aligns correctly with the text string.
                 */
                <HighlightedText
                  text={commentary}
                  charIdx={highlightCharIdx}
                  active
                  className="text-dark-600 dark:text-dark-300 leading-relaxed whitespace-pre-wrap"
                />
              ) : (
                <div className="space-y-3">
                  {commentary.split('\n\n').map((para, i) => (
                    <p key={i} className="text-dark-600 dark:text-dark-300 leading-relaxed">{para}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Audio Player ── */}
      <section aria-label="Audio recitation" className="rounded-2xl border border-warm-200 dark:border-dark-700 bg-white dark:bg-dark-800 overflow-hidden">

        {/* Header strip */}
        <div className="flex items-center gap-2 px-4 pt-3.5 pb-3 border-b border-warm-100 dark:border-dark-700">
          <Volume2 className="w-4 h-4 text-saffron-500 shrink-0" />
          <span className="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-widest flex-1">
            Sanskrit Recitation
          </span>
          {/* Live status badge */}
          {!isIdle && (
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              isPaused
                ? 'bg-dark-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400'
                : 'bg-saffron-50 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-400',
            )}>
              {isPaused
                ? `⏸ Paused · ${highlightSection ? SECTION_LABEL[highlightSection] : ''}`
                : isLoading
                ? '⌛ Loading…'
                : `▶ ${highlightSection ? SECTION_LABEL[highlightSection] : ''}`}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">

          {/* What to read — mode selector */}
          <div className="flex gap-1.5">
            {([
              { id: 'sanskrit'    as AudioMode, label: 'Sanskrit'     },
              { id: 'translation' as AudioMode, label: 'Translation'  },
              { id: 'full'        as AudioMode, label: 'Full reading' },
            ]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { if (isIdle) setAudioMode(id); }}
                disabled={!isIdle}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  audioMode === id
                    ? 'bg-saffron-500 text-white border-saffron-500'
                    : 'border-warm-200 dark:border-dark-700 text-dark-500 dark:text-dark-400 hover:border-saffron-300 dark:hover:border-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2">

            {isIdle && (
              <button
                onClick={() => handlePlay()}
                className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:shadow-glow hover:-translate-y-0.5 transition-all"
              >
                <Play className="w-4 h-4 fill-current" /> Play
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
              isIdle ? 'ml-2' : 'ml-auto',
            )}>
              {([0.75, 1, 1.5] as const).map(spd => (
                <button
                  key={spd}
                  onClick={() => { setAudioSpeed(spd); speedRef.current = spd; }}
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
          {audioMode === 'full' && isIdle && (
            <p className="text-xs text-dark-400 dark:text-dark-500 text-center">
              Reads Sanskrit → Translation{commentary ? ' → Commentary' : ''} in sequence
            </p>
          )}

          <p className="text-xs text-dark-400 dark:text-dark-500 text-center">
            Uses browser speech synthesis · Best in Chrome or Edge
          </p>
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
