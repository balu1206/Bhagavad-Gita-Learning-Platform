import Link from 'next/link';
import { BookOpen, ArrowRight, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export interface LastRead {
  chapter:      number;
  verse:        number;
  chapterTitle: string;
  totalVerses:  number;
  translation:  string;
}

interface ContinueCardProps {
  lastRead?: LastRead | null;
}

export function ContinueCard({ lastRead }: ContinueCardProps) {
  if (!lastRead) {
    return (
      <Card variant="elevated" className="p-6">
        <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-1">
          Start Reading
        </p>
        <h2 className="font-serif text-xl text-dark-900 dark:text-white mb-2">
          Begin your journey
        </h2>
        <p className="text-dark-500 dark:text-dark-400 text-sm mb-6">
          Start with Chapter 1 and let the wisdom of the Gita unfold.
        </p>
        <div className="bg-warm-50 dark:bg-dark-800 rounded-xl p-4 mb-6">
          <p className="font-sanskrit text-base text-dark-800 dark:text-dark-200 leading-relaxed mb-2">
            {String.fromCharCode(2325,2352,2381,2350,2339,2381,2351,2375,2357,2366,2343,2367,2325,2366,2352,2360,2381,2340,2375)}
          </p>
          <p className="text-dark-500 dark:text-dark-400 text-sm italic">
            &ldquo;You have a right to perform your duties, but not to the fruits of action.&rdquo;
          </p>
        </div>
        <Link href="/chapters/1/1">
          <Button fullWidth>
            <BookOpen className="w-4 h-4" />
            Start Reading
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>
    );
  }

  const chapterProgress = Math.round((lastRead.verse / lastRead.totalVerses) * 100);
  const nextVerse       = Math.min(lastRead.verse + 1, lastRead.totalVerses);
  const preview         = lastRead.translation.length > 120
    ? lastRead.translation.slice(0, 117) + '...'
    : lastRead.translation;

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-1">
            Continue Reading
          </p>
          <h2 className="font-serif text-xl text-dark-900 dark:text-white mb-1">
            Chapter {lastRead.chapter}: {lastRead.chapterTitle}
          </h2>
          <p className="text-dark-500 dark:text-dark-400 text-sm">
            Verse {lastRead.verse} of {lastRead.totalVerses}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-saffron-600 dark:text-saffron-400" />
        </div>
      </div>

      <div className="bg-warm-50 dark:bg-dark-800 rounded-xl p-4 mb-6">
        <p className="text-dark-500 dark:text-dark-400 text-sm italic">
          &ldquo;{preview}&rdquo;
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-dark-500 dark:text-dark-400">Chapter progress</span>
          <span className="font-medium text-saffron-600 dark:text-saffron-400">{chapterProgress}%</span>
        </div>
        <ProgressBar value={chapterProgress} className="h-2" />
      </div>

      <div className="flex gap-3">
        <Link href={`/chapters/${lastRead.chapter}/${nextVerse}`} className="flex-1">
          <Button fullWidth>
            <BookOpen className="w-4 h-4" />
            Continue Reading
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/listen?chapter=${lastRead.chapter}&verse=${lastRead.verse}`}>
          <Button variant="secondary" size="md">
            <Play className="w-4 h-4" />
            Listen
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export function ContinueCardSkeleton() {
  return (
    <Card variant="elevated" className="p-6">
      <Skeleton className="h-4 w-28 mb-2" />
      <Skeleton className="h-6 w-56 mb-1" />
      <Skeleton className="h-4 w-32 mb-6" />
      <Skeleton className="h-20 w-full rounded-xl mb-6" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-2 w-full mb-6" />
      <Skeleton className="h-10 w-full" />
    </Card>
  );
}
