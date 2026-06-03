'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Check, MessageCircle, X } from 'lucide-react';

// X (formerly Twitter) logo — removed from lucide-react in newer versions
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.731-8.843L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { useToast } from '@/components/ui/Toast/Toast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  chapter: number;
  verse: number;
  sanskrit: string;
  translation: string;
}

export function ShareButton({ chapter, verse, sanskrit, translation }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const verseRef = `BG ${chapter}.${verse}`;
  const shortTranslation = translation.length > 200 ? translation.slice(0, 197) + '…' : translation;
  const shareText = `${verseRef}\n\n${sanskrit}\n\n"${shortTranslation}"\n\n— Bhagavad Gita`;
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://bhagavad-gita-learning-platform.vercel.app/chapters/${chapter}/${verse}`;

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ message: 'Could not copy link', variant: 'error' });
    }
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const shareTwitter = () => {
    const tweetText = `${verseRef} — "${shortTranslation.slice(0, 140)}…"\n\n${shareUrl} #BhagavadGita #GitaPath`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const nativeShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `Bhagavad Gita ${verseRef}`, text: shareText, url: shareUrl });
        setOpen(false);
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
        aria-label="Share this verse"
        aria-expanded={open}
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-50 w-56 rounded-2xl border border-warm-200 dark:border-dark-700 bg-white dark:bg-dark-800 shadow-large overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100 dark:border-dark-700">
            <p className="text-xs font-semibold text-dark-600 dark:text-dark-300">Share this Shloka</p>
            <button
              onClick={() => setOpen(false)}
              className="text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
              aria-label="Close share menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Options */}
          <div className="p-2 space-y-0.5">
            <button
              onClick={copyLink}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
                'hover:bg-warm-50 dark:hover:bg-dark-700',
                copied && 'text-green-600 dark:text-green-400',
              )}
            >
              {copied
                ? <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
                : <Link2 className="w-4 h-4 flex-shrink-0 text-dark-400" />
              }
              <span>{copied ? 'Link copied!' : 'Copy link'}</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-warm-50 dark:hover:bg-dark-700 transition-colors text-left"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
              <span className="text-dark-700 dark:text-dark-200">Share on WhatsApp</span>
            </button>

            <button
              onClick={shareTwitter}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-warm-50 dark:hover:bg-dark-700 transition-colors text-left"
            >
              <XLogo className="w-4 h-4 flex-shrink-0 text-dark-700 dark:text-dark-200" />
              <span className="text-dark-700 dark:text-dark-200">Post on X / Twitter</span>
            </button>

            {/* Native share — only shown if supported */}
            {typeof window !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={nativeShare}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-warm-50 dark:hover:bg-dark-700 transition-colors text-left"
              >
                <Share2 className="w-4 h-4 flex-shrink-0 text-saffron-500" />
                <span className="text-dark-700 dark:text-dark-200">More options…</span>
              </button>
            )}
          </div>

          {/* Verse preview snippet */}
          <div className="mx-2 mb-2 rounded-xl bg-saffron-50 dark:bg-saffron-900/20 border border-saffron-100 dark:border-saffron-800 p-3">
            <p className="text-xs font-semibold text-saffron-600 dark:text-saffron-400 mb-1">{verseRef}</p>
            <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed line-clamp-2">
              &ldquo;{shortTranslation}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
