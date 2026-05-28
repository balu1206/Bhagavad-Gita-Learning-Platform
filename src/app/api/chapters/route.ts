import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Hardcoded fallback — ensures the UI always shows chapters even if the DB
// query returns empty (e.g. seeding not yet run).
const CHAPTER_FALLBACK = [
  { number: 1,  title: 'Arjuna Vishada Yoga',              verseCount: 47 },
  { number: 2,  title: 'Sankhya Yoga',                     verseCount: 72 },
  { number: 3,  title: 'Karma Yoga',                       verseCount: 43 },
  { number: 4,  title: 'Jnana Karma Sanyasa Yoga',         verseCount: 42 },
  { number: 5,  title: 'Karma Sanyasa Yoga',               verseCount: 29 },
  { number: 6,  title: 'Dhyana Yoga',                      verseCount: 47 },
  { number: 7,  title: 'Gyana Vigyana Yoga',               verseCount: 30 },
  { number: 8,  title: 'Aksara Brahma Yoga',               verseCount: 28 },
  { number: 9,  title: 'Raja Vidya Raja Guhya Yoga',       verseCount: 34 },
  { number: 10, title: 'Vibhuti Yoga',                     verseCount: 42 },
  { number: 11, title: 'Vishvarupa Darshana Yoga',         verseCount: 55 },
  { number: 12, title: 'Bhakti Yoga',                      verseCount: 20 },
  { number: 13, title: 'Kshetra Kshetrajna Vibhaga Yoga',  verseCount: 35 },
  { number: 14, title: 'Gunatraya Vibhaga Yoga',           verseCount: 27 },
  { number: 15, title: 'Purushottama Yoga',                verseCount: 20 },
  { number: 16, title: 'Daivasura Sampad Vibhaga Yoga',    verseCount: 24 },
  { number: 17, title: 'Shraddhatraya Vibhaga Yoga',       verseCount: 28 },
  { number: 18, title: 'Moksha Sanyasa Yoga',              verseCount: 78 },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId  = (session?.user as { id?: string } | undefined)?.id ?? null;

  let chapters: {
    id: string;
    number: number;
    slug: string;
    title: string;
    titleSanskrit: string;
    transliteration: string;
    summary: string;
    verseCount: number;
  }[] = [];

  try {
    chapters = await prisma.chapter.findMany({
      orderBy: { number: 'asc' },
      select: {
        id:              true,
        number:          true,
        slug:            true,
        title:           true,
        titleSanskrit:   true,
        transliteration: true,
        summary:         true,
        verseCount:      true,
      },
    });
  } catch {
    // DB unavailable — fall through to hardcoded data
  }

  // If DB returned nothing, synthesise from hardcoded fallback
  if (!chapters.length) {
    chapters = CHAPTER_FALLBACK.map(ch => ({
      id:              `chapter-${ch.number}`,
      number:          ch.number,
      slug:            `chapter-${ch.number}`,
      title:           ch.title,
      titleSanskrit:   '',
      transliteration: '',
      summary:         `${ch.title} — Chapter ${ch.number}.`,
      verseCount:      ch.verseCount,
    }));
  }

  // Build per-chapter read counts for authenticated users
  const progressMap = new Map<string, number>();
  if (userId) {
    try {
      const rows = await prisma.userProgress.groupBy({
        by:    ['chapterId'],
        where: { userId },
        _count: { verseId: true },
      });
      for (const row of rows) progressMap.set(row.chapterId, row._count.verseId);
    } catch {
      // Progress unavailable — versesRead stays 0
    }
  }

  return NextResponse.json(
    chapters.map(ch => ({ ...ch, versesRead: progressMap.get(ch.id) ?? 0 })),
  );
}
