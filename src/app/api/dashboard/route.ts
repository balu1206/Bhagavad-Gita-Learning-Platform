import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { currentStreak: true, longestStreak: true, totalXp: true },
  });

  const [versesRead, bookmarksCount, recentBookmarks, lastProgress, chapterProgress] = await Promise.all([
    prisma.userProgress.count({ where: { userId } }),

    prisma.bookmark.count({ where: { userId } }),

    prisma.bookmark.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      take:    3,
      include: {
        verse: {
          select: {
            number:      true,
            slug:        true,
            translation: true,
            chapter:     { select: { number: true, title: true } },
          },
        },
      },
    }),

    prisma.userProgress.findFirst({
      where:   { userId },
      orderBy: { readAt: 'desc' },
      include: {
        verse:   { select: { number: true, translation: true } },
        chapter: { select: { number: true, title: true, verseCount: true } },
      },
    }),

    prisma.userProgress.groupBy({
      by:    ['chapterId'],
      where: { userId },
      _count: { verseId: true },
    }),
  ]);

  return NextResponse.json({
    versesRead,
    bookmarksCount,
    currentStreak:  user?.currentStreak  ?? 0,
    longestStreak:  user?.longestStreak  ?? 0,
    totalXp:        user?.totalXp        ?? 0,
    recentBookmarks: recentBookmarks.map((b: typeof recentBookmarks[0]) => ({
      id:           b.id,
      verseId:      b.verseId,
      note:         b.note,
      tags:         b.tags,
      createdAt:    b.createdAt.toISOString(),
      verse: {
        number:      b.verse.number,
        slug:        b.verse.slug,
        translation: b.verse.translation,
        chapter:     b.verse.chapter,
      },
    })),
    lastRead: lastProgress
      ? {
          chapter:      lastProgress.chapter.number,
          verse:        lastProgress.verse.number,
          chapterTitle: lastProgress.chapter.title,
          totalVerses:  lastProgress.chapter.verseCount,
          translation:  lastProgress.verse.translation,
        }
      : null,
    chapterProgress: chapterProgress.map((cp: typeof chapterProgress[0]) => ({
      chapterId: cp.chapterId,
      count:     cp._count.verseId,
    })),
  });
}
