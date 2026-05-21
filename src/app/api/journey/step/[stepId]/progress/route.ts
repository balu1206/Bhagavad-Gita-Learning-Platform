import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/journey/step/[stepId]/progress — mark a lesson as read
export async function POST(
  req: NextRequest,
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
    select: { id: true },
  });
  if (!step) return NextResponse.json({ error: 'Step not found' }, { status: 404 });

  const body = await req.json();
  const lessonIndex: number = body.lessonIndex ?? 0;

  // Upsert progress — increment lessonsRead, set status to IN_PROGRESS
  const existing = await (prisma.userJourneyProgress as any).findUnique({
    where: { userId_stepId: { userId: user.id, stepId: step.id } },
  });

  const newLessonsRead = Math.max((existing?.lessonsRead ?? 0), lessonIndex + 1);

  await (prisma.userJourneyProgress as any).upsert({
    where: { userId_stepId: { userId: user.id, stepId: step.id } },
    update: {
      lessonsRead: newLessonsRead,
      status: 'IN_PROGRESS',
      startedAt: existing?.startedAt ?? new Date(),
    },
    create: {
      userId: user.id,
      stepId: step.id,
      lessonsRead: newLessonsRead,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, lessonsRead: newLessonsRead });
}
