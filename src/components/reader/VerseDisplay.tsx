'use client';

import { useState, useCallback, useRef } from 'react';
import { Volume2, Square, ChevronDown, ChevronUp, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton';
import { useToast } from '@/components/ui/Toast/Toast';

interface VerseDisplayProps {
  chapter: number;
  verse: number;
  verseId?: string;
  chapterId?: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  commentary?: string;
}

export function VerseDisplay({
  chapter, verse, verseId, chapterId, sanskrit, transliteration, translation, commentary,
}: VerseDisplayProps) {
  const { toast } = useToast();
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [commentaryOpen, setCommentaryOpen] = useState(false);
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioState('idle');
  }, []);

  const handlePlayAudio = useCallback(async () => {
    if (audioState === 'playing') { stopAudio(); return; }
    if (audioState === 'loading') return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setAudioState('loading');
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(sanskrit);
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('sa')) ??
                        voices.find(v => v.lang.startsWith('hi')) ??
                        voices.find(v => v.lang.startsWith('mr')) ?? null;
      if (preferred) utterance.voice = preferred;
      utterance.lang = preferred?.lang ?? 'hi-IN';
      utterance.rate = 0.75;
      utterance.pitch = 1.0;

      utterance.onstart  = () => setAudioState('playing');
      utterance.onend    = () => setAudioState('idle');
      utterance.onerror  = () => {
        setAudioState('idle');
        toast({ message: 'Audio playback failed', variant: 'error' });
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setTimeout(() => setAudioState(s => s === 'loading' ? 'playing' : s), 300);
      return;
    }

    toast({
      message: 'Audio not supported in this browser',
      description: 'Try Chrome or Edge for browser-based recitation.',
      variant: 'warning',
    });
  }, [audioState, sanskrit, stopAudio, toast]);

  return (
    <article className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-warm-200 dark:to-dark-700" />
        <span className="text-xs font-semibold text-saffron-500 dark:text-saffron-400 uppercase tracking-widest px-2">
          Chapter {chapter} &middot; Verse {verse}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-warm-200 dark:to-dark-700" />
      </div>

      <section aria-label="Sanskrit verse">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest">
            Sanskrit
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTransliteration((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
              aria-label={showTransliteration ? 'Hide transliteration' : 'Show transliteration'}
            >
              {showTransliteration ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showTransliteration ? 'Hide' : 'Show'} transliteration
            </button>
            <button
              onClick={handlePlayAudio}
              disabled={audioState === 'loading'}
              className="flex items-center gap-1 text-xs text-saffron-600 dark:text-saffron-400 hover:text-saffron-700 transition-colors disabled:opacity-60"
              aria-label={audioState === 'playing' ? 'Stop audio' : audioState === 'loading' ? 'Loading audio' : 'Play audio'}
            >
              {audioState === 'loading'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : audioState === 'playing'
                ? <Square className="w-3.5 h-3.5 fill-current" />
                : <Volume2 className="w-3.5 h-3.5" />
              }
              {audioState === 'loading' ? 'Loading' : audioState === 'playing' ? 'Stop' : 'Listen'}
            </button>
            {verseId && chapterId && (
              <BookmarkButton verseId={verseId} chapterId={chapterId} size="sm" />
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-warm-50 to-saffron-50/30 dark:from-dark-800 dark:to-dark-800/50 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-dark-700">
          <p className="font-sanskrit text-xl sm:text-2xl md:text-3xl text-dark-900 dark:text-white leading-loose text-center whitespace-pre-line">
            {sanskrit}
          </p>
          {showTransliteration && (
            <p className="mt-4 text-sm text-dark-500 dark:text-dark-400 italic text-center leading-relaxed whitespace-pre-line">
              {transliteration}
            </p>
          )}
        </div>
      </section>

      <section aria-label="Translation">
        <h2 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-4">
          Translation
        </h2>
        <blockquote className="border-l-4 border-saffron-400 dark:border-saffron-600 pl-6 py-2">
          <p className="text-dark-800 dark:text-dark-100 text-lg leading-relaxed font-serif">
            &ldquo;{translation}&rdquo;
          </p>
          <footer className="mt-3 text-sm text-dark-400 dark:text-dark-500">
            &mdash; Swami Sivananda, <cite>The Bhagavad Gita</cite> (Divine Life Society)
          </footer>
        </blockquote>
      </section>

      {commentary && (
        <section aria-label="Commentary">
          <button
            onClick={() => setCommentaryOpen((o) => !o)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-warm-50 dark:bg-dark-800 border border-warm-200 dark:border-dark-700 hover:border-saffron-300 dark:hover:border-saffron-700 transition-colors group"
            aria-expanded={commentaryOpen}
          >
            <span className="text-sm font-semibold text-dark-700 dark:text-dark-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
              Commentary
            </span>
            {commentaryOpen
              ? <ChevronUp className="w-4 h-4 text-dark-400" />
              : <ChevronDown className="w-4 h-4 text-dark-400" />
            }
          </button>

          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            commentaryOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0',
          )}>
            <div className="px-4 py-2 space-y-3">
              {commentary.split('\n\n').map((para, i) => (
                <p key={i} className="text-dark-600 dark:text-dark-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

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
