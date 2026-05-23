import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await (prisma.user as any).findUnique({
    where: { email: session.user.email },
    select: {
      id: true, name: true, email: true,
      createdAt: true, totalXp: true, level: true,
      currentStreak: true, longestStreak: true,
    },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [progress, bookmarks, journeyProgress, achievements] = await Promise.all([
    (prisma.userProgress as any).findMany({
      where: { userId: user.id },
      select: {
        readAt: true, listenedAt: true,
        verse: { select: { slug: true, sanskrit: true, translation: true } },
        chapter: { select: { number: true, title: true } },
      },
    }),
    (prisma.bookmark as any).findMany({
      where: { userId: user.id },
      select: {
        createdAt: true, note: true, tags: true,
        verse: { select: { slug: true, sanskrit: true, translation: true } },
      },
    }),
    (prisma.userJourneyProgress as any).findMany({
      where: { userId: user.id },
      select: {
        status: true, quizScore: true, completedAt: true,
        step: { select: { title: true, order: true } },
      },
    }),
    (prisma.userAchievement as any).findMany({
      where: { userId: user.id },
      select: {
        unlockedAt: true, xpAwarded: true,
        achievement: { select: { title: true, slug: true, rarity: true } },
      },
    }),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      name: user.name,
      email: user.email,
      memberSince: user.createdAt,
      totalXp: user.totalXp,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    },
    readingProgress: progress.map((p: any) => ({
      verse: p.verse?.slug,
      chapter: p.chapter?.number,
      chapterTitle: p.chapter?.title,
      readAt: p.readAt,
      listenedAt: p.listenedAt,
    })),
    bookmarks: bookmarks.map((b: any) => ({
      verse: b.verse?.slug,
      sanskrit: b.verse?.sanskrit,
      translation: b.verse?.translation,
      note: b.note,
      tags: b.tags,
      savedAt: b.createdAt,
    })),
    journeyProgress: journeyProgress.map((j: any) => ({
      step: j.step?.order,
      title: j.step?.title,
      status: j.status,
      quizScore: j.quizScore,
      completedAt: j.completedAt,
    })),
    achievements: achievements.map((a: any) => ({
      title: a.achievement?.title,
      slug: a.achievement?.slug,
      rarity: a.achievement?.rarity,
      xpAwarded: a.xpAwarded,
      unlockedAt: a.unlockedAt,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="gitapath-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}
