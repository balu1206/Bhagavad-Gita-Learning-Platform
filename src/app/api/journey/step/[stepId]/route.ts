import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { stepId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await (prisma.user as any).findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const step = await (prisma.journeyStep as any).findUnique({
    where: { slug: params.stepId },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      quizQuestions: { orderBy: { order: 'asc' } },
      userProgress: {
        where: { userId: user.id },
        take: 1,
      },
    },
  });

  if (!step) {
    return NextResponse.json({ error: 'Step not found' }, { status: 404 });
  }

  const progress = step.userProgress[0];

  return NextResponse.json({
    id: step.id,
    order: step.order,
    slug: step.slug,
    title: step.title,
    subtitle: step.subtitle,
    icon: step.icon,
    estimatedMinutes: step.estimatedMinutes,
    lessons: step.lessons,
    quizQuestions: step.quizQuestions,
    status: progress?.status ?? 'UNLOCKED',
    lessonsRead: progress?.lessonsRead ?? 0,
    quizScore: progress?.quizScore ?? null,
    quizPassed: progress?.quizPassed ?? false,
  });
}
