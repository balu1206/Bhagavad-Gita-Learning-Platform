import { NextRequest, NextResponse } from 'next/server';
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
      id: true, name: true, email: true, image: true, bio: true,
      createdAt: true, totalXp: true, level: true,
      currentStreak: true, longestStreak: true,
      fontSize: true, readingTheme: true,
      showTransliteration: true, showWordByWord: true,
      playbackSpeed: true, autoAdvance: true,
      _count: {
        select: {
          progress: true,
          bookmarks: true,
          journeyProgress: true,
          achievements: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Count verses read (distinct versesId where readAt set)
  const versesRead = await (prisma.userProgress as any).count({
    where: { userId: user.id },
  });

  // Count chapters with at least one verse read
  const chaptersStarted = await (prisma.userProgress as any).findMany({
    where: { userId: user.id },
    select: { chapterId: true },
    distinct: ['chapterId'],
  });

  const journeyStepsCompleted = await (prisma.userJourneyProgress as any).count({
    where: { userId: user.id, status: 'COMPLETED' },
  });

  return NextResponse.json({
    name: user.name ?? 'Seeker',
    email: user.email,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt,
    totalXp: user.totalXp,
    level: user.level,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    versesRead,
    chaptersStarted: chaptersStarted.length,
    bookmarksCount: user._count.bookmarks,
    journeyStepsCompleted,
    achievementsCount: user._count.achievements,
    // Reading prefs
    fontSize: user.fontSize,
    readingTheme: user.readingTheme,
    showTransliteration: user.showTransliteration,
    showWordByWord: user.showWordByWord,
    playbackSpeed: user.playbackSpeed,
    autoAdvance: user.autoAdvance,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Whitelist fields that may be updated
  const allowed = [
    'name', 'bio',
    'fontSize', 'readingTheme', 'showTransliteration', 'showWordByWord',
    'playbackSpeed', 'autoAdvance',
  ];

  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const updated = await (prisma.user as any).update({
    where: { email: session.user.email },
    data,
    select: { name: true, bio: true },
  });

  return NextResponse.json({ ok: true, ...updated });
}
