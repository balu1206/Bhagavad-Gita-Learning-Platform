import Link from 'next/link';
import { Sparkles, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';

const RECOMMENDED = [
  { chapter: 2, verse: 47,  title: 'The Central Teaching',    desc: 'Act without attachment to results — the essence of Karma Yoga.' },
  { chapter: 4, verse: 7,   title: 'The Promise of Return',    desc: 'Whenever dharma declines, the Divine manifests to restore order.' },
  { chapter: 6, verse: 5,   title: 'Raise Yourself',           desc: 'Let the self be lifted by the Self — you are your own friend and foe.' },
  { chapter: 11, verse: 32, title: 'I am Time',               desc: 'The awe-inspiring revelation of Krishna as cosmic Time itself.' },
  { chapter: 12, verse: 13, title: 'The Beloved Devotee',      desc: 'One who has no enemies, who is friendly and compassionate to all.' },
  { chapter: 18, verse: 66, title: 'Surrender All',            desc: 'Abandon all duties and surrender to me alone — the final teaching.' },
];

export function RecommendedScroller() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-saffron-500" />
        <h2 className="font-serif text-xl text-dark-900 dark:text-white">Famous Verses</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECOMMENDED.map((v) => (
          <Link key={`${v.chapter}-${v.verse}`} href={`/chapters/${v.chapter}/${v.verse}`}>
            <Card variant="interactive" className="p-5 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
                </div>
                <span className="text-xs font-semibold text-saffron-600 dark:text-saffron-400 uppercase tracking-wide">
                  {v.chapter}.{v.verse}
                </span>
              </div>
              <p className="font-medium text-dark-800 dark:text-dark-100 mb-2 text-sm">{v.title}</p>
              <p className="text-dark-500 dark:text-dark-400 text-xs leading-relaxed line-clamp-2">{v.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
