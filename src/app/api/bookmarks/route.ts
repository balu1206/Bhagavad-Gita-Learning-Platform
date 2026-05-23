import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  verseId:   z.string(),
  chapterId: z.string(),
  note:      z.string().max(2000).optional(),
  tags:      z.array(z.string().max(30)).max(10).optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search  = searchParams.get('q') ?? '';
  const chapter = searchParams.get('chapter');
  const tag     = searchParams.get('tag');
  const sort    = searchParams.get('sort') ?? 'newest';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { userId };
  if (chapter) where.chapterId = chapter;
  if (tag)     where.tags = { has: tag };
  if (search)  where.OR = [
    { note: { contains: search, mode: 'insensitive' } },
    { verse: { translation: { contains: search, mode: 'insensitive' } } },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderBy: Record<string, any> =
    sort === 'oldest'   ? { createdAt: 'asc' } :
    sort === 'chapter'  ? { verse: { globalNumber: 'asc' } } :
    { createdAt: 'desc' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookmarks = await (prisma.bookmark as any).findMany({
    where, orderBy,
    include: {
      verse: {
        select: {
          id: true, number: true, globalNumber: true, slug: true,
          sanskrit: true, translation: true,
          chapter: { select: { id: true, number: true, title: true } },
        },
      },
    },
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json() as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { verseId, chapterId, note, tags } = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookmark = await (prisma.bookmark as any).upsert({
    where:  { userId_verseId: { userId, verseId } },
    update: { note, tags: tags ?? [] },
    create: { userId, verseId, chapterId, note, tags: tags ?? [] },
  });

  return NextResponse.json({ bookmark }, { status: 201 });
}
