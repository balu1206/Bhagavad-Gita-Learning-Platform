import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Returns daily verse-read counts for the past 365 days
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

  const since = new Date();
  since.setDate(since.getDate() - 364);

  const progress = await (prisma.userProgress as any).findMany({
    where: { userId: user.id, readAt: { gte: since } },
    select: { readAt: true },
  });

  // Aggregate by date
  const counts: Record<string, number> = {};
  for (const p of progress) {
    const date = (p.readAt as Date).toISOString().split('T')[0];
    counts[date] = (counts[date] ?? 0) + 1;
  }

  // Build full 365-day array
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: dateStr, count: counts[dateStr] ?? 0 });
  }

  return NextResponse.json(days);
}
