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
    select: { id: true, totalXp: true, level: true, currentStreak: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Get all 8 journey steps with user progress
  const steps = await (prisma.journeyStep as any).findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { lessons: true } },
      userProgress: {
        where: { userId: user.id },
        take: 1,
      },
    },
  });

  // Build step list with locked/unlocked logic
  let prevCompleted = true; // step 1 starts unlocked
  const stepsWithStatus = steps.map((step: any, idx: number) => {
    const progress = step.userProgress[0];
    let status = progress?.status ?? (prevCompleted ? 'UNLOCKED' : 'LOCKED');

    // If no DB progress yet, determine from ordering
    if (!progress) {
      if (idx === 0) status = 'UNLOCKED';
      else status = prevCompleted ? 'UNLOCKED' : 'LOCKED';
    }

    prevCompleted = status === 'COMPLETED';

    return {
      id: step.id,
      order: step.order,
      slug: step.slug,
      title: step.title,
      subtitle: step.subtitle,
      icon: step.icon,
      estimatedMinutes: step.estimatedMinutes,
      lessonCount: step._count.lessons,
      status,
      lessonsRead: progress?.lessonsRead ?? 0,
      quizScore: progress?.quizScore ?? null,
      quizPassed: progress?.quizPassed ?? false,
    };
  });

  const stepsCompleted = stepsWithStatus.filter(
    (s: any) => s.status === 'COMPLETED',
  ).length;

  return NextResponse.json({
    steps: stepsWithStatus,
    stats: {
      totalXp: user.totalXp,
      level: user.level,
      currentStreak: user.currentStreak,
      stepsCompleted,
    },
  });
}
