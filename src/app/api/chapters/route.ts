import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId  = (session?.user as { id?: string } | undefined)?.id ?? null;

  const chapters = await prisma.chapter.findMany({
    orderBy: { number: 'asc' },
    select: {
      id:             true,
      number:         true,
      slug:           true,
      title:          true,
      titleSanskrit:  true,
      transliteration: true,
      summary:        true,
      verseCount:     true,
    },
  });

  // Build per-chapter read counts for authenticated users
  const progressMap = new Map<string, number>();
  if (userId) {
    const rows = await prisma.userProgress.groupBy({
      by:    ['chapterId'],
      where: { userId },
      _count: { verseId: true },
    });
    for (const row of rows) progressMap.set(row.chapterId, row._count.verseId);
  }

  return NextResponse.json(
    chapters.map((ch: typeof chapters[0]) => ({ ...ch, versesRead: progressMap.get(ch.id) ?? 0 })),
  );
}
