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
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const allAchievements = await (prisma.achievement as any).findMany({
    orderBy: [{ rarity: 'desc' }, { title: 'asc' }],
  });

  const userAchievements = await (prisma.userAchievement as any).findMany({
    where: { userId: user.id },
    select: { achievementId: true, unlockedAt: true },
  });

  const unlockedMap = new Map(
    userAchievements.map((ua: any) => [ua.achievementId, ua.unlockedAt]),
  );

  const result = allAchievements.map((ach: any) => ({
    id: ach.id,
    slug: ach.slug,
    title: ach.title,
    description: ach.description,
    icon: ach.icon,
    xpReward: ach.xpReward,
    rarity: ach.rarity,
    unlockedAt: unlockedMap.get(ach.id) ?? null,
  }));

  return NextResponse.json(result);
}
