import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/verses/:chapter/:verse
 * Public — no auth required. Returns Sanskrit + transliteration + translation.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { chapter: string; verse: string } },
) {
  const ch = parseInt(params.chapter);
  const v  = parseInt(params.verse);

  if (isNaN(ch) || ch < 1 || ch > 18 || isNaN(v) || v < 1) {
    return NextResponse.json({ error: 'Invalid chapter or verse' }, { status: 400 });
  }

  try {
    const verse = await prisma.verse.findUnique({
      where:  { slug: `${ch}-${v}` },
      select: { sanskrit: true, transliteration: true, translation: true },
    });

    if (!verse) {
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
    }

    return NextResponse.json(verse, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
