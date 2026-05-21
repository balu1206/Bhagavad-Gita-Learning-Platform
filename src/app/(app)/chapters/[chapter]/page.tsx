import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';

interface PageProps { params: { chapter: string } }

const CHAPTER_META: Record<number, { title: string; titleSanskrit: string; summary: string; verseCount: number }> = {
  1:  { title: 'Arjuna Vishada Yoga',           titleSanskrit: 'अर्जुन विषाद योग',      summary: 'Arjuna surveys the battlefield and is overcome with grief.',  verseCount: 47 },
  2:  { title: 'Sankhya Yoga',                  titleSanskrit: 'सांख्य योग',             summary: 'Krishna begins teaching the eternal nature of the soul.',      verseCount: 72 },
  3:  { title: 'Karma Yoga',                    titleSanskrit: 'कर्म योग',               summary: 'Act without attachment — fulfill duties for the greater good.', verseCount: 43 },
  4:  { title: 'Jnana Karma Sanyasa Yoga',      titleSanskrit: 'ज्ञान कर्म संन्यास योग', summary: 'Wisdom and renunciation lead to liberation.',                  verseCount: 42 },
  5:  { title: 'Karma Sanyasa Yoga',            titleSanskrit: 'कर्म संन्यास योग',       summary: 'Renunciation and selfless action both lead to the same goal.', verseCount: 29 },
  6:  { title: 'Dhyana Yoga',                   titleSanskrit: 'ध्यान योग',              summary: 'Practical meditation — quieting the mind, finding the Self.',   verseCount: 47 },
  7:  { title: 'Gyana Vigyana Yoga',            titleSanskrit: 'ज्ञान विज्ञान योग',      summary: 'Krishna reveals his divine nature and the nature of reality.',  verseCount: 30 },
  8:  { title: 'Aksara Brahma Yoga',            titleSanskrit: 'अक्षर ब्रह्म योग',       summary: 'The imperishable — Brahman, karma, and attaining the divine.',  verseCount: 28 },
  9:  { title: 'Raja Vidya Raja Guhya Yoga',    titleSanskrit: 'राज विद्या राज गुह्य योग', summary: 'The royal secret — devotion, surrender, and divine union.',   verseCount: 34 },
  10: { title: 'Vibhuti Yoga',                  titleSanskrit: 'विभूति योग',             summary: 'The divine glory — how Krishna permeates all of creation.',    verseCount: 42 },
  11: { title: 'Vishvarupa Darshana Yoga',      titleSanskrit: 'विश्वरूप दर्शन योग',     summary: 'Arjuna beholds the awe-inspiring cosmic form of Krishna.',     verseCount: 55 },
  12: { title: 'Bhakti Yoga',                   titleSanskrit: 'भक्ति योग',              summary: 'Pure love and devotion — the highest and most direct path.',   verseCount: 20 },
  13: { title: 'Kshetra Kshetrajna Vibhaga Yoga', titleSanskrit: 'क्षेत्र क्षेत्रज्ञ विभाग योग', summary: 'The body (field) and the soul (the eternal knower).', verseCount: 35 },
  14: { title: 'Gunatraya Vibhaga Yoga',        titleSanskrit: 'गुणत्रय विभाग योग',      summary: 'Tamas, rajas, sattva — the three qualities and transcendence.', verseCount: 27 },
  15: { title: 'Purushottama Yoga',             titleSanskrit: 'पुरुषोत्तम योग',         summary: 'The supreme person — beyond creation, the transcendent divine.', verseCount: 20 },
  16: { title: 'Daivasura Sampad Vibhaga Yoga', titleSanskrit: 'दैवासुर सम्पद् विभाग योग', summary: 'Divine and demoniac qualities — what leads to liberation.',  verseCount: 24 },
  17: { title: 'Shraddhatraya Vibhaga Yoga',    titleSanskrit: 'श्रद्धात्रय विभाग योग',   summary: 'Three kinds of faith shape worship, diet, and sacrifice.',      verseCount: 28 },
  18: { title: 'Moksha Sanyasa Yoga',           titleSanskrit: 'मोक्ष संन्यास योग',       summary: 'Liberation — the grand synthesis and final call to surrender.', verseCount: 78 },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ch = parseInt(params.chapter);
  const meta = CHAPTER_META[ch];
  if (!meta) return {};
  return { title: `Chapter ${ch}: ${meta.title}` };
}

export default function ChapterPage({ params }: PageProps) {
  const ch = parseInt(params.chapter);
  const meta = CHAPTER_META[ch];
  if (!meta) notFound();

  // Placeholder: verses 1-47 read in ch1, 1-47 in ch2
  const versesRead = ch === 1 ? 47 : ch === 2 ? 47 : 0;
  const pct = Math.round((versesRead / meta.verseCount) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Chapter header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-dark-400 dark:text-dark-500 mb-3">
          <Link href="/chapters" className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
            All Chapters
          </Link>
          <span>/</span>
          <span>Chapter {ch}</span>
        </div>

        <p className="font-sanskrit text-lg text-saffron-600 dark:text-saffron-400 mb-1">
          {meta.titleSanskrit}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-dark-900 dark:text-white mb-3">
          {meta.title}
        </h1>
        <p className="text-dark-500 dark:text-dark-400 text-lg leading-relaxed max-w-2xl mb-6">
          {meta.summary}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href={`/chapters/${ch}/${versesRead > 0 ? versesRead : 1}`}>
            <Button>
              <BookOpen className="w-4 h-4" />
              {versesRead > 0 ? 'Continue Reading' : 'Start Reading'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/listen?chapter=${ch}`}>
            <Button variant="secondary">
              <Play className="w-4 h-4" />
              Listen
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      {versesRead > 0 && (
        <Card variant="elevated" className="p-4 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-500 dark:text-dark-400">Chapter progress</span>
            <span className="font-medium text-saffron-600 dark:text-saffron-400">
              {versesRead} / {meta.verseCount} verses · {pct}%
            </span>
          </div>
          <ProgressBar value={pct} className="h-2" />
        </Card>
      )}

      {/* Verse list */}
      <div className="space-y-1">
        <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-3">
          {meta.verseCount} Verses
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: meta.verseCount }, (_, i) => i + 1).map((v) => {
            const isRead = v <= versesRead;
            const isCurrent = v === versesRead + 1;
            return (
              <Link key={v} href={`/chapters/${ch}/${v}`}>
                <div className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all text-sm
                  ${isRead
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                    : isCurrent
                    ? 'bg-saffron-50 border-saffron-300 text-saffron-700 dark:bg-saffron-900/20 dark:border-saffron-700 dark:text-saffron-400'
                    : 'bg-white border-warm-100 text-dark-500 hover:border-saffron-200 dark:bg-dark-800 dark:border-dark-700 dark:text-dark-400 dark:hover:border-saffron-800'
                  }
                `}>
                  <span className="font-medium">{ch}.{v}</span>
                  {isRead && <span className="text-green-500 text-xs">✓</span>}
                  {isCurrent && <Badge variant="warning" size="sm">Next</Badge>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
