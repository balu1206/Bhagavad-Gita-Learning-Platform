'use client';

import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Bell, Search, X, BookOpen, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  className?: string;
}

// ── Static search index ─────────────────────────────────────────────────────

interface SearchResult {
  label: string;
  sublabel: string;
  href: string;
}

const CHAPTER_DATA: { number: number; title: string; sanskrit: string }[] = [
  { number: 1,  title: 'Arjuna Vishada Yoga',           sanskrit: 'अर्जुन विषाद योग' },
  { number: 2,  title: 'Sankhya Yoga',                  sanskrit: 'सांख्य योग' },
  { number: 3,  title: 'Karma Yoga',                    sanskrit: 'कर्म योग' },
  { number: 4,  title: 'Jnana Karma Sanyasa Yoga',      sanskrit: 'ज्ञान कर्म संन्यास योग' },
  { number: 5,  title: 'Karma Sanyasa Yoga',            sanskrit: 'कर्म संन्यास योग' },
  { number: 6,  title: 'Dhyana Yoga',                   sanskrit: 'ध्यान योग' },
  { number: 7,  title: 'Gyana Vigyana Yoga',            sanskrit: 'ज्ञान विज्ञान योग' },
  { number: 8,  title: 'Aksara Brahma Yoga',            sanskrit: 'अक्षर ब्रह्म योग' },
  { number: 9,  title: 'Raja Vidya Raja Guhya Yoga',    sanskrit: 'राज विद्या राज गुह्य योग' },
  { number: 10, title: 'Vibhuti Yoga',                  sanskrit: 'विभूति योग' },
  { number: 11, title: 'Vishvarupa Darshana Yoga',      sanskrit: 'विश्वरूप दर्शन योग' },
  { number: 12, title: 'Bhakti Yoga',                   sanskrit: 'भक्ति योग' },
  { number: 13, title: 'Kshetra Kshetrajna Vibhaga Yoga', sanskrit: 'क्षेत्र क्षेत्रज्ञ विभाग योग' },
  { number: 14, title: 'Gunatraya Vibhaga Yoga',        sanskrit: 'गुणत्रय विभाग योग' },
  { number: 15, title: 'Purushottama Yoga',             sanskrit: 'पुरुषोत्तम योग' },
  { number: 16, title: 'Daivasura Sampad Vibhaga Yoga', sanskrit: 'दैवासुर सम्पद् विभाग योग' },
  { number: 17, title: 'Shraddhatraya Vibhaga Yoga',    sanskrit: 'श्रद्धात्रय विभाग योग' },
  { number: 18, title: 'Moksha Sanyasa Yoga',           sanskrit: 'मोक्ष संन्यास योग' },
];

// e.g. "2.47" or "2 47" or "chapter 2 verse 47"
function parseVerseRef(q: string): { chapter: number; verse: number } | null {
  const dotMatch = q.match(/^(\d+)\.(\d+)$/);
  if (dotMatch) return { chapter: parseInt(dotMatch[1]), verse: parseInt(dotMatch[2]) };
  const spaceMatch = q.match(/^(\d+)\s+(\d+)$/);
  if (spaceMatch) return { chapter: parseInt(spaceMatch[1]), verse: parseInt(spaceMatch[2]) };
  return null;
}

function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  // Verse ref (e.g. "2.47")
  const ref = parseVerseRef(q);
  if (ref && ref.chapter >= 1 && ref.chapter <= 18 && ref.verse >= 1) {
    const ch = CHAPTER_DATA[ref.chapter - 1];
    results.push({
      label: `Verse ${ref.chapter}.${ref.verse}`,
      sublabel: ch?.title ?? `Chapter ${ref.chapter}`,
      href: `/chapters/${ref.chapter}/${ref.verse}`,
    });
  }

  // Chapter matches
  for (const ch of CHAPTER_DATA) {
    if (
      ch.title.toLowerCase().includes(q) ||
      ch.sanskrit.includes(q) ||
      `chapter ${ch.number}`.includes(q) ||
      `ch ${ch.number}` === q ||
      String(ch.number) === q
    ) {
      results.push({
        label: `Chapter ${ch.number}: ${ch.title}`,
        sublabel: ch.sanskrit,
        href: `/chapters/${ch.number}`,
      });
    }
  }

  // Famous verse keywords
  const famousVerses: { keywords: string[]; label: string; href: string; sublabel: string }[] = [
    { keywords: ['karma', 'action', 'duty', 'fruit', 'karmanyeva'],        label: 'Verse 2.47',  sublabel: 'You have a right to perform your duties…',    href: '/chapters/2/47' },
    { keywords: ['yoga', 'mind', 'restless', 'wind'],                      label: 'Verse 6.34',  sublabel: 'The mind is restless, turbulent…',             href: '/chapters/6/34' },
    { keywords: ['dharma', 'righteousness', 'decline', 'manifest', 'yada'], label: 'Verse 4.7', sublabel: 'Whenever dharma declines, I manifest myself…',  href: '/chapters/4/7' },
    { keywords: ['surrender', 'sarva dharman', 'moksha', 'liberation'],    label: 'Verse 18.66', sublabel: 'Abandon all dharmas and take refuge in me…',   href: '/chapters/18/66' },
    { keywords: ['soul', 'atman', 'eternal', 'weapon', 'fire', 'kill'],    label: 'Verse 2.23',  sublabel: 'The soul cannot be cut by weapons…',           href: '/chapters/2/23' },
  ];

  for (const fv of famousVerses) {
    if (fv.keywords.some((k) => q.includes(k)) && !results.some((r) => r.href === fv.href)) {
      results.push({ label: fv.label, sublabel: fv.sublabel, href: fv.href });
    }
  }

  return results.slice(0, 6);
}

// ── SearchModal ──────────────────────────────────────────────────────────────

function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = search(query);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const go = useCallback((href: string) => {
    onClose();
    router.push(href);
  }, [onClose, router]);

  return (
    <div className="fixed inset-0 z-[1060] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-large border border-warm-100 dark:border-dark-700 overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-100 dark:border-dark-800">
          <Search className="w-5 h-5 text-dark-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters, verses, or topics…"
            className="flex-1 bg-transparent text-dark-900 dark:text-dark-100 placeholder-dark-400 outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-dark-400 hover:text-dark-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-dark-400 hover:text-dark-600 transition-colors ml-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-warm-200 dark:border-dark-700 text-xs text-dark-400">Esc</kbd>
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((r) => (
              <li key={r.href}>
                <button
                  onClick={() => go(r.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-50 dark:hover:bg-dark-800 transition-colors text-left"
                >
                  <BookOpen className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 dark:text-dark-100">{r.label}</p>
                    <p className="text-xs text-dark-400 dark:text-dark-500 truncate">{r.sublabel}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-300 flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        ) : query ? (
          <div className="px-4 py-8 text-center">
            <p className="text-dark-500 dark:text-dark-400 text-sm">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-dark-400 dark:text-dark-500 text-xs mt-1">
              Try a chapter name, verse number (e.g. &ldquo;2.47&rdquo;), or topic like &ldquo;karma&rdquo;
            </p>
          </div>
        ) : (
          <div className="px-4 py-6">
            <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-3">Quick links</p>
            <div className="space-y-1">
              {[
                { label: 'Browse all chapters', href: '/chapters' },
                { label: 'Your bookmarks',      href: '/bookmarks' },
                { label: 'Beginner journey',    href: '/journey' },
              ].map((l) => (
                <button key={l.href} onClick={() => go(l.href)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-warm-50 dark:hover:bg-dark-800 transition-colors text-left"
                >
                  <ChevronRight className="w-4 h-4 text-dark-300" />
                  <span className="text-sm text-dark-600 dark:text-dark-300">{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NotificationsPanel ───────────────────────────────────────────────────────

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="absolute inset-0 z-[1050]" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 z-[1060] w-80 bg-white dark:bg-dark-900 border border-warm-200 dark:border-dark-700 rounded-2xl shadow-large overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100 dark:border-dark-800">
          <h3 className="text-sm font-semibold text-dark-800 dark:text-dark-100">Notifications</h3>
          <button onClick={onClose} className="p-1 rounded text-dark-400 hover:text-dark-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-8 text-center">
          <Bell className="w-8 h-8 text-dark-200 dark:text-dark-700 mx-auto mb-3" />
          <p className="text-sm text-dark-500 dark:text-dark-400">No notifications yet</p>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">
            Streak reminders and achievements will appear here
          </p>
        </div>
      </div>
    </>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

export function Header({ title, className }: HeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Seeker';
  const [searchOpen,        setSearchOpen]        = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[1020] flex items-center gap-4 px-4 md:px-6 h-14',
          'border-b border-warm-100 dark:border-dark-700',
          'bg-warm-50/80 dark:bg-dark-900/80 backdrop-blur-lg',
          className,
        )}
      >
        {title && (
          <h1 className="font-serif font-semibold text-dark-900 dark:text-dark-100 text-base truncate flex-1">
            {title}
          </h1>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="rounded-lg p-2 text-dark-400 hover:bg-warm-100 hover:text-dark-700 dark:hover:bg-dark-800 dark:hover:text-dark-200 transition-colors focus-visible:ring-2 focus-visible:ring-saffron-500 focus:outline-none"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setNotificationsOpen((o) => !o)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              className="rounded-lg p-2 text-dark-400 hover:bg-warm-100 hover:text-dark-700 dark:hover:bg-dark-800 dark:hover:text-dark-200 transition-colors focus-visible:ring-2 focus-visible:ring-saffron-500 focus:outline-none"
            >
              <Bell className="h-5 w-5" />
            </button>
            {notificationsOpen && (
              <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
            )}
          </div>

          <ThemeToggle />

          <button
            aria-label="Open profile menu"
            className="ml-1 rounded-full focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus:outline-none"
          >
            <Avatar size="sm" name={userName} />
          </button>
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
