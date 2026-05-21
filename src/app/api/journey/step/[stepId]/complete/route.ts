import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const STEP_XP = 100; // XP per completed step
const QUIZ_BONUS_XP = 50; // Bonus XP for perfect quiz
const XP_PER_LEVEL = 200;

// Achievements that could be unlocked on step completion
const STEP_ACHIEVEMENTS: Record<number, string[]> = {
  1: ['first-step'],
  3: ['knowledge-seeker'],
  4: ['halfway-there'],
  8: ['journey-complete'],
};

// POST /api/journey/step/[stepId]/complete — mark step as completed after passing quiz
export async function POST(
  req: NextRequest,
  { params }: { params: { stepId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const quizScore: number = body.score ?? 0;
  const passed = quizScore >= 70;

  if (!passed) {
    return NextResponse.json({ ok: false, error: 'Quiz not passed' }, { status: 400 });
  }

  const user = await (prisma.user as any).findUnique({
    where: { email: session.user.email },
    select: { id: true, totalXp: true, level: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const step = await (prisma.journeyStep as any).findUnique({
    where: { slug: params.stepId },
    select: { id: true, order: true },
  });
  if (!step) return NextResponse.json({ error: 'Step not found' }, { status: 404 });

  // Mark step completed
  await (prisma.userJourneyProgress as any).upsert({
    where: { userId_stepId: { userId: user.id, stepId: step.id } },
    update: {
      status: 'COMPLETED',
      quizScore,
      quizPassed: true,
      completedAt: new Date(),
    },
    create: {
      userId: user.id,
      stepId: step.id,
      status: 'COMPLETED',
      quizScore,
      quizPassed: true,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  // Unlock next step
  const nextStep = await (prisma.journeyStep as any).findFirst({
    where: { order: step.order + 1 },
    select: { id: true },
  });
  if (nextStep) {
    const existingNext = await (prisma.userJourneyProgress as any).findUnique({
      where: { userId_stepId: { userId: user.id, stepId: nextStep.id } },
    });
    if (!existingNext) {
      await (prisma.userJourneyProgress as any).create({
        data: {
          userId: user.id,
          stepId: nextStep.id,
          status: 'UNLOCKED',
        },
      });
    }
  }

  // Award XP
  const earnedXp = STEP_XP + (quizScore === 100 ? QUIZ_BONUS_XP : 0);
  const newTotalXp = user.totalXp + earnedXp;
  const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;

  await (prisma.user as any).update({
    where: { id: user.id },
    data: { totalXp: newTotalXp, level: newLevel },
  });

  // Check achievements
  const unlockedAchievements: string[] = [];
  const stepAchievements = STEP_ACHIEVEMENTS[step.order] ?? [];

  for (const slug of stepAchievements) {
    const achievement = await (prisma.achievement as any).findUnique({
      where: { slug },
    });
    if (!achievement) continue;

    const alreadyHas = await (prisma.userAchievement as any).findUnique({
      where: { userId_achievementId: { userId: user.id, achievementId: achievement.id } },
    });
    if (!alreadyHas) {
      await (prisma.userAchievement as any).create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
          xpAwarded: achievement.xpReward,
        },
      });
      // Award achievement XP too
      await (prisma.user as any).update({
        where: { id: user.id },
        data: { totalXp: { increment: achievement.xpReward } },
      });
      unlockedAchievements.push(achievement.slug);
    }
  }

  // Check quiz-master achievement
  if (quizScore === 100) {
    const qmAch = await (prisma.achievement as any).findUnique({ where: { slug: 'quiz-master' } });
    if (qmAch) {
      const alreadyHas = await (prisma.userAchievement as any).findUnique({
        where: { userId_achievementId: { userId: user.id, achievementId: qmAch.id } },
      });
      if (!alreadyHas) {
        await (prisma.userAchievement as any).create({
          data: { userId: user.id, achievementId: qmAch.id, xpAwarded: qmAch.xpReward },
        });
        unlockedAchievements.push(qmAch.slug);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    xpEarned: earnedXp,
    newTotalXp,
    newLevel,
    levelUp: newLevel > user.level,
    unlockedAchievements,
  });
}
