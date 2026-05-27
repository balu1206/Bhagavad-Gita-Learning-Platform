import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReadingShell } from '@/components/reader/ReadingShell';
import { VerseDisplay } from '@/components/reader/VerseDisplay';
import { VerseProgressTracker } from '@/components/reader/VerseProgressTracker';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: { chapter: string; verse: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ch = parseInt(params.chapter);
  const v  = parseInt(params.verse);
  if (isNaN(ch) || isNaN(v)) return {};

  const verse = await prisma.verse.findUnique({
    where: { slug: `${ch}-${v}` },
    select: {
      translation: true,
      translationAuthor: true,
      chapter: { select: { title: true } },
    },
  });

  if (!verse) return { title: `Chapter ${ch}, Verse ${v} — Bhagavad Gita` };

  const description =
    verse.translation.length > 155
      ? verse.translation.substring(0, 152) + '...'
      : verse.translation;

  return {
    title: `BG ${ch}.${v} — ${verse.chapter.title} | Bhagavad Gita`,
    description,
    openGraph: {
      title: `Bhagavad Gita ${ch}.${v}`,
      description,
    },
  };
}

export default async function VersePage({ params }: PageProps) {
  const ch = parseInt(params.chapter);
  const v  = parseInt(params.verse);

  if (isNaN(ch) || ch < 1 || ch > 18 || isNaN(v) || v < 1) notFound();

  const verse = await prisma.verse.findUnique({
    where: { slug: `${ch}-${v}` },
    include: { chapter: true },
  });

  if (!verse) notFound();

  return (
    <ReadingShell
      chapter={ch}
      verse={v}
      totalVerses={verse.chapter.verseCount}
      chapterTitle={verse.chapter.title}
    >
      <VerseProgressTracker verseId={verse.id} chapterId={verse.chapterId} />
      <VerseDisplay
        chapter={ch}
        verse={v}
        verseId={verse.id}
        chapterId={verse.chapterId}
        sanskrit={verse.sanskrit}
        transliteration={verse.transliteration}
        translation={verse.translation}
        commentary={verse.commentary ?? undefined}
      />
    </ReadingShell>
  );
}
