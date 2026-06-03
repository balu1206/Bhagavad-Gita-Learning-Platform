import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { ContinueCard } from '@/components/dashboard/ContinueCard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { RecentBookmarks } from '@/components/dashboard/RecentBookmarks';
import { RecommendedScroller } from '@/components/dashboard/RecommendedScroller';

export const metadata: Metadata = { title: 'Dashboard' };

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = (session.user as { id?: string }).id ?? null;

  const user = (session.user ?? {}) as {
    name?:  string | null;
    email?: string | null;
    image?: string | null;
  };

  const [dbUser, chapters, progressRows, recentBookmarks, lastProgress] = await Promise.all([
    userId
      ? prisma.user.findUnique({
          where:  { id: userId },
          select: { currentStreak: true, longestStreak: true, totalXp: true },
        })
      : null,

    prisma.chapter.findMany({
      orderBy: { number: 'asc' },
      select:  { id: true, number: true, title: true, verseCount: true },
    }),

    userId
      ? prisma.userProgress.groupBy({
          by:    ['chapterId'],
          where: { userId },
          _count: { verseId: true },
        })
      : [],

    userId
      ? prisma.bookmark.findMany({
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
        })
      : [],

    userId
      ? prisma.userProgress.findFirst({
          where:   { userId },
          orderBy: { readAt: 'desc' },
          include: {
            verse:   { select: { number: true, translation: true } },
            chapter: { select: { number: true, title: true, verseCount: true } },
          },
        })
      : null,
  ]);

  const progressMap = new Map(
    (progressRows as Array<{ chapterId: string; _count: { verseId: number } }>)
      .map((r) => [r.chapterId, r._count.verseId]),
  );

  const versesRead = (progressRows as Array<{ _count: { verseId: number } }>)
    .reduce((s, r) => s + r._count.verseId, 0);

  const chaptersWithProgress = chapters.map((ch: { id: string; number: number; title: string; verseCount: number }) => ({
    ...ch,
    versesRead: progressMap.get(ch.id) ?? 0,
  }));

  const stats = {
    versesRead,
    bookmarksCount: recentBookmarks.length,
    currentStreak:  dbUser?.currentStreak ?? 0,
    longestStreak:  dbUser?.longestStreak ?? 0,
    totalXp:        dbUser?.totalXp       ?? 0,
  };

  const lastRead = lastProgress
    ? {
        chapter:      (lastProgress as { chapter: { number: number; title: string; verseCount: number } }).chapter.number,
        verse:        (lastProgress as { verse: { number: number } }).verse.number,
        chapterTitle: (lastProgress as { chapter: { title: string } }).chapter.title,
        totalVerses:  (lastProgress as { chapter: { verseCount: number } }).chapter.verseCount,
        translation:  (lastProgress as { verse: { translation: string } }).verse.translation,
      }
    : null;

  const bookmarksForDisplay = (recentBookmarks as Array<{ id: string; verseId: string; note: string | null; tags: string[]; createdAt: Date; verse: { number: number; slug: string; translation: string; chapter: { number: number; title: string } } }>).map((b) => ({
    id:        b.id,
    verseId:   b.verseId,
    note:      b.note,
    tags:      b.tags,
    createdAt: b.createdAt.toISOString(),
    verse: {
      number:      b.verse.number,
      slug:        b.verse.slug,
      translation: b.verse.translation,
      chapter:     b.verse.chapter,
    },
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeBanner name={user.name ?? null} image={user.image ?? null} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContinueCard lastRead={lastRead} />
        </div>
        <div>
          <StatsGrid stats={stats} />
        </div>
      </div>

      <ProgressSection chapters={chaptersWithProgress} versesRead={versesRead} />
      <RecentBookmarks bookmarks={bookmarksForDisplay} />
      <RecommendedScroller />
    </div>
  );
}
