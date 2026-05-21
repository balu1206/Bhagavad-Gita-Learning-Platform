'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Flame } from 'lucide-react';
import { ChapterCard, type ChapterCardData } from '@/components/chapters/ChapterCard';
import { ChaptersFilter, type FilterStatus } from '@/components/chapters/ChaptersFilter';
import { CircularProgress } from '@/components/ui/ProgressBar/ProgressBar';

// Placeholder data — replaced with real DB fetch in Day 20
const CHAPTERS_DATA: ChapterCardData[] = [
  { number: 1,  slug: 'chapter-1-arjuna-vishada-yoga',           title: 'Arjuna Vishada Yoga',             titleSanskrit: 'अर्जुन विषाद योग',           transliteration: 'Arjuna Viṣāda Yoga',          verseCount: 47,  versesRead: 47 },
  { number: 2,  slug: 'chapter-2-sankhya-yoga',                  title: 'Sankhya Yoga',                    titleSanskrit: 'सांख्य योग',                  transliteration: 'Sāṅkhya Yoga',                verseCount: 72,  versesRead: 47 },
  { number: 3,  slug: 'chapter-3-karma-yoga',                    title: 'Karma Yoga',                      titleSanskrit: 'कर्म योग',                    transliteration: 'Karma Yoga',                  verseCount: 43,  versesRead: 0  },
  { number: 4,  slug: 'chapter-4-jnana-karma-sanyasa-yoga',      title: 'Jnana Karma Sanyasa Yoga',        titleSanskrit: 'ज्ञान कर्म संन्यास योग',      transliteration: 'Jñāna Karma Sanyāsa Yoga',    verseCount: 42,  versesRead: 0  },
  { number: 5,  slug: 'chapter-5-karma-sanyasa-yoga',            title: 'Karma Sanyasa Yoga',              titleSanskrit: 'कर्म संन्यास योग',            transliteration: 'Karma Sanyāsa Yoga',          verseCount: 29,  versesRead: 0  },
  { number: 6,  slug: 'chapter-6-dhyana-yoga',                   title: 'Dhyana Yoga',                     titleSanskrit: 'ध्यान योग',                   transliteration: 'Dhyāna Yoga',                 verseCount: 47,  versesRead: 0  },
  { number: 7,  slug: 'chapter-7-gyana-vigyana-yoga',            title: 'Gyana Vigyana Yoga',              titleSanskrit: 'ज्ञान विज्ञान योग',           transliteration: 'Jñāna Vijñāna Yoga',          verseCount: 30,  versesRead: 0  },
  { number: 8,  slug: 'chapter-8-aksara-brahma-yoga',            title: 'Aksara Brahma Yoga',              titleSanskrit: 'अक्षर ब्रह्म योग',            transliteration: 'Akṣara Brahma Yoga',          verseCount: 28,  versesRead: 0  },
  { number: 9,  slug: 'chapter-9-raja-vidya-raja-guhya-yoga',    title: 'Raja Vidya Raja Guhya Yoga',      titleSanskrit: 'राज विद्या राज गुह्य योग',    transliteration: 'Rāja Vidyā Rāja Guhya Yoga',  verseCount: 34,  versesRead: 0  },
  { number: 10, slug: 'chapter-10-vibhuti-yoga',                 title: 'Vibhuti Yoga',                    titleSanskrit: 'विभूति योग',                  transliteration: 'Vibhūti Yoga',                verseCount: 42,  versesRead: 0  },
  { number: 11, slug: 'chapter-11-vishvarupa-darshana-yoga',     title: 'Vishvarupa Darshana Yoga',        titleSanskrit: 'विश्वरूप दर्शन योग',         transliteration: 'Viśvarūpa Darśana Yoga',      verseCount: 55,  versesRead: 0  },
  { number: 12, slug: 'chapter-12-bhakti-yoga',                  title: 'Bhakti Yoga',                     titleSanskrit: 'भक्ति योग',                   transliteration: 'Bhakti Yoga',                 verseCount: 20,  versesRead: 0  },
  { number: 13, slug: 'chapter-13-kshetra-kshetrajna-yoga',      title: 'Kshetra Kshetrajna Vibhaga Yoga', titleSanskrit: 'क्षेत्र क्षेत्रज्ञ विभाग योग', transliteration: 'Kṣetra Kṣetrajña Vibhāga Yoga', verseCount: 35, versesRead: 0 },
  { number: 14, slug: 'chapter-14-gunatraya-vibhaga-yoga',       title: 'Gunatraya Vibhaga Yoga',          titleSanskrit: 'गुणत्रय विभाग योग',          transliteration: 'Guṇatraya Vibhāga Yoga',      verseCount: 27,  versesRead: 0  },
  { number: 15, slug: 'chapter-15-purushottama-yoga',            title: 'Purushottama Yoga',               titleSanskrit: 'पुरुषोत्तम योग',             transliteration: 'Puruṣottama Yoga',            verseCount: 20,  versesRead: 0  },
  { number: 16, slug: 'chapter-16-daivasura-sampad-yoga',        title: 'Daivasura Sampad Vibhaga Yoga',   titleSanskrit: 'दैवासुर सम्पद् विभाग योग',   transliteration: 'Daivāsura Sampad Vibhāga Yoga', verseCount: 24, versesRead: 0 },
  { number: 17, slug: 'chapter-17-shraddhatraya-vibhaga-yoga',   title: 'Shraddhatraya Vibhaga Yoga',      titleSanskrit: 'श्रद्धात्रय विभाग योग',       transliteration: 'Śraddhātraya Vibhāga Yoga',   verseCount: 28,  versesRead: 0  },
  { number: 18, slug: 'chapter-18-moksha-sanyasa-yoga',          title: 'Moksha Sanyasa Yoga',             titleSanskrit: 'मोक्ष संन्यास योग',           transliteration: 'Mokṣa Sanyāsa Yoga',          verseCount: 78,  versesRead: 0  },
];

export default function ChaptersPage() {
  const [query, setQuery]   = useState('');
  const [status, setStatus] = useState<FilterStatus>('all');

  const filtered = useMemo(() => {
    let result = CHAPTERS_DATA;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.titleSanskrit.includes(q) ||
          c.transliteration.toLowerCase().includes(q) ||
          c.summary?.toLowerCase().includes(q) ||
          String(c.number) === q,
      );
    }
    if (status === 'not-started') result = result.filter((c) => c.versesRead === 0);
    if (status === 'in-progress') result = result.filter((c) => c.versesRead > 0 && c.versesRead < c.verseCount);
    if (status === 'complete')    result = result.filter((c) => c.versesRead === c.verseCount);
    return result;
  }, [query, status]);

  const totalRead   = CHAPTERS_DATA.reduce((s, c) => s + c.versesRead, 0);
  const totalVerses = CHAPTERS_DATA.reduce((s, c) => s + c.verseCount, 0);
  const overallPct  = Math.round((totalRead / totalVerses) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-saffron-500" />
            <p className="text-sm text-saffron-600 dark:text-saffron-400 font-medium uppercase tracking-widest">
              All Chapters
            </p>
          </div>
          <h1 className="font-serif text-3xl text-dark-900 dark:text-white">
            The Bhagavad Gita
          </h1>
          <p className="text-dark-400 dark:text-dark-500 text-sm mt-1">
            18 chapters · 700 verses · Timeless wisdom
          </p>
        </div>

        {/* Overall progress ring */}
        <div className="flex items-center gap-4 bg-white dark:bg-dark-800 rounded-2xl border border-warm-100 dark:border-dark-700 p-4 self-start">
          <CircularProgress value={overallPct} size={60} strokeWidth={5} />
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">{overallPct}% complete</p>
            <p className="text-sm text-dark-400 dark:text-dark-500">{totalRead} / {totalVerses} verses</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ChaptersFilter
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          totalCount={CHAPTERS_DATA.length}
          filteredCount={filtered.length}
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((chapter) => (
            <ChapterCard key={chapter.number} chapter={chapter} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Flame className="w-12 h-12 text-dark-200 dark:text-dark-700 mx-auto mb-4" />
          <p className="text-dark-500 dark:text-dark-400 font-medium">No chapters match your search</p>
          <button
            onClick={() => { setQuery(''); setStatus('all'); }}
            className="mt-3 text-saffron-600 dark:text-saffron-400 text-sm underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
