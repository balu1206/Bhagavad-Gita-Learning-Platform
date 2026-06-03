'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Settings,
  X, ArrowLeft, Share2, Check, Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast/Toast';

interface ReadingShellProps {
  chapter: number;
  verse: number;
  totalVerses: number;
  chapterTitle: string;
  children: ReactNode;
}

type FontSize = 'sm' | 'md' | 'lg';
const FONT_SIZE_KEY = 'gita-reading-font-size';

export function ReadingShell({
  chapter, verse, totalVerses, chapterTitle, children,
}: ReadingShellProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [shareSuccess, setShareSuccess] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
    if (saved && ['sm', 'md', 'lg'].includes(saved)) setFontSize(saved);
  }, []);

  const saveFontSize = useCallback((size: FontSize) => {
    setFontSize(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHeaderVisible(y < lastScrollYRef.current || y < 60);
        lastScrollYRef.current = y;
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'l') {
        if (verse < totalVerses) router.push(`/chapters/${chapter}/${verse + 1}`);
      }
      if (e.key === 'ArrowLeft' || e.key === 'h') {
        if (verse > 1) router.push(`/chapters/${chapter}/${verse - 1}`);
      }
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapter, verse, totalVerses, router]);

  const handleShare = useCallback(async () => {
    const url  = window.location.href;
    const text = `Bhagavad Gita ${chapter}.${verse} — ${chapterTitle}`;
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      toast({ message: 'Link copied!', description: url, variant: 'success' });
      setTimeout(() => setShareSuccess(false), 2000);
    } catch {
      toast({ message: 'Could not copy link', variant: 'error' });
    }
  }, [chapter, verse, chapterTitle, toast]);

  const prevHref = verse > 1 ? `/chapters/${chapter}/${verse - 1}` : `/chapters/${chapter}`;
  const nextHref = verse < totalVerses
    ? `/chapters/${chapter}/${verse + 1}`
    : chapter < 18 ? `/chapters/${chapter + 1}/1` : null;
  const progress = Math.round((verse / totalVerses) * 100);
  const fontSizeClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : '';

  return (
    <div className={cn('min-h-screen bg-cream-50 dark:bg-dark-950 flex flex-col', fontSizeClass)}>
      {/* Collapsible top header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-[1040]',
        'bg-cream-50/90 dark:bg-dark-950/90 backdrop-blur-xl',
        'border-b border-warm-200/60 dark:border-dark-800/60 transition-transform duration-500',
        headerVisible ? 'translate-y-0' : '-translate-y-full',
      )}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href={`/chapters/${chapter}`}
            className="flex items-center gap-1.5 text-dark-400 hover:text-saffron-600 dark:hover:text-saffron-400 text-sm transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-light">{chapterTitle}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-sanskrit text-sm text-saffron-500">||</span>
            <span className="font-display font-semibold text-dark-800 dark:text-cream-200 text-sm tabular">
              {chapter}.{verse}
            </span>
            <span className="text-dark-300 dark:text-dark-600 text-sm tabular">/ {totalVerses}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className={cn(
                'p-2 rounded-lg transition-colors duration-300',
                shareSuccess ? 'text-saffron-500' : 'text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800',
              )}
              aria-label="Share verse"
            >
              {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className={cn(
                'p-2 rounded-lg transition-colors duration-300',
                settingsOpen ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-900/20' : 'text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-800',
              )}
              aria-label="Reading settings"
              aria-expanded={settingsOpen}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-px bg-warm-200 dark:bg-dark-800">
          <div
            className="h-full bg-gradient-to-r from-saffron-400 to-gold-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Settings panel */}
      {settingsOpen && (
        <div className="fixed top-[57px] right-4 z-[1050] w-72 bezel-card shadow-xl">
          <div className="bezel-core p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold text-dark-800 dark:text-cream-100">Reading Settings</h3>
              <button onClick={() => setSettingsOpen(false)} className="p-1 rounded text-dark-400 hover:text-dark-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-saffron-600 dark:text-saffron-500 mb-2.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Font Size
              </p>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => saveFontSize(size)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-300',
                      fontSize === size
                        ? 'bg-saffron-500 text-white border-saffron-500'
                        : 'border-warm-200 dark:border-dark-700 text-dark-500 dark:text-dark-400 hover:border-saffron-400',
                    )}
                  >
                    {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {settingsOpen && <div className="fixed inset-0 z-[1045]" onClick={() => setSettingsOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>

      {/* Sticky bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[1040] bg-cream-50/90 dark:bg-dark-950/90 backdrop-blur-xl border-t border-warm-200/60 dark:border-dark-800/60">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href={prevHref}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              verse > 1
                ? 'text-dark-600 dark:text-dark-300 hover:bg-warm-100 dark:hover:bg-dark-800'
                : 'text-dark-200 dark:text-dark-700 pointer-events-none',
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-dark-400 dark:text-dark-500 tabular">{verse} of {totalVerses}</span>
            <div className="w-24 h-px bg-warm-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron-400 to-gold-400 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {nextHref ? (
            <Link href={nextHref} className="btn-primary text-sm px-5 py-2">
              <span className="hidden sm:inline">{verse < totalVerses ? 'Next' : 'Next Chapter'}</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-saffron-500/20 text-saffron-700 dark:text-saffron-400">
              <span className="hidden sm:inline">Complete</span>
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
