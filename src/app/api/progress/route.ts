import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** POST /api/progress  — mark a verse as read for the current user */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { verseId?: string; chapterId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { verseId, chapterId } = body;
  if (!verseId || !chapterId) return NextResponse.json({ error: 'verseId and chapterId required' }, { status: 400 });

  // Upsert progress (idempotent — reading same verse multiple times counts once)
  await prisma.userProgress.upsert({
    where:  { userId_verseId: { userId, verseId } },
    update: { readAt: new Date() },
    create: { userId, verseId, chapterId, readAt: new Date() },
  });

  // Update streak — fire-and-forget style (don't block the response)
  updateStreak(userId).catch(() => null);

  return NextResponse.json({ success: true });
}

async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastActiveAt: true },
  });
  if (!user) return;

  const now = new Date();
  const lastActive = user.lastActiveAt;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86_400_000);

  let newStreak = user.currentStreak;

  if (!lastActive) {
    // First ever activity
    newStreak = 1;
  } else {
    const lastDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    if (lastDay.getTime() === today.getTime()) {
      // Already active today — no change
      return;
    } else if (lastDay.getTime() === yesterday.getTime()) {
      // Active yesterday → extend streak
      newStreak = user.currentStreak + 1;
    } else {
      // Gap > 1 day → reset
      newStreak = 1;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastActiveAt: now,
    },
  });
}
