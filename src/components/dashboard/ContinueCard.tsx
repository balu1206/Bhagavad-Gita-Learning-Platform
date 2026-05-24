import Link from 'next/link';
import { BookOpen, ArrowRight, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';

export function ContinueCard() {
  // Placeholder data — real data fetched from DB in Phase 3 Day 20
  // verse is the last COMPLETED verse; Continue Reading navigates to the next unread one.
  const lastVerse = { chapter: 2, verse: 47, chapterTitle: 'Sankhya Yoga', totalVerses: 72 };
  const chapterProgress = 65; // percent
  const nextVerse = Math.min(lastVerse.verse + 1, lastVerse.totalVerses);

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-1">
            Continue Reading
          </p>
          <h2 className="font-serif text-xl text-dark-900 dark:text-white mb-1">
            Chapter {lastVerse.chapter}: {lastVerse.chapterTitle}
          </h2>
          <p className="text-dark-500 dark:text-dark-400 text-sm">
            Verse {lastVerse.verse} of 72 · Karma Yoga
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-saffron-600 dark:text-saffron-400" />
        </div>
      </div>

      {/* Famous verse preview */}
      <div className="bg-warm-50 dark:bg-dark-800 rounded-xl p-4 mb-6">
        <p className="font-sanskrit text-base text-dark-800 dark:text-dark-200 leading-relaxed mb-2">
          कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
        </p>
        <p className="text-dark-500 dark:text-dark-400 text-sm italic">
          &ldquo;You have a right to perform your duties, but not to the fruits of action.&rdquo;
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-dark-500 dark:text-dark-400">Chapter progress</span>
          <span className="font-medium text-saffron-600 dark:text-saffron-400">{chapterProgress}%</span>
        </div>
        <ProgressBar value={chapterProgress} className="h-2" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href={`/chapters/${lastVerse.chapter}/${nextVerse}`} className="flex-1">
          <Button fullWidth>
            <BookOpen className="w-4 h-4" />
            Continue Reading
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/listen?chapter=${lastVerse.chapter}&verse=${lastVerse.verse}`}>
          <Button variant="secondary" size="md">
            <Play className="w-4 h-4" />
            Listen
          </Button>
        </Link>
      </div>
    </Card>
  );
}
