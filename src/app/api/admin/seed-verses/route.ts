/**
 * One-time admin endpoint to seed all 701 Bhagavad Gita verses
 * Source: github.com/gita/gita (Unlicense / public domain)
 * Translation & Commentary: Swami Sivananda (public domain)
 *
 * Usage:
 *   POST /api/admin/seed-verses
 *   Body: { "secret": "gita-2026-seed-unlock" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

const SEED_SECRET = 'gita-2026-seed-unlock';
const SIVANANDA_AUTHOR_ID = 16;
const GITHUB_RAW = 'https://raw.githubusercontent.com/gita/gita/main/data';

interface GVerse {
  id: number;
  chapter_number: number;
  verse_number: number;
  text: string;
  transliteration: string;
  word_meanings: string;
}

interface GTranslation {
  verse_id: number;
  author_id: number;
  description: string;
}

interface GCommentary {
  verse_id: number;
  author_id: number;
  description: string;
}

export async function POST(req: NextRequest) {
  // ── Auth ───────────────────────────────────────────────────────
  let secret: string | undefined;
  try {
    const body = (await req.json()) as { secret?: string };
    secret = body.secret;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ── Fetch chapters from DB to build chapterNumber → chapterId map ──
    const dbChapters = await prisma.chapter.findMany({
      select: { id: true, number: true },
    });

    if (dbChapters.length === 0) {
      return NextResponse.json(
        { error: 'No chapters found in database. Run prisma db seed first.' },
        { status: 400 },
      );
    }

    const chapterMap = new Map<number, string>(
      dbChapters.map(c => [c.number, c.id]),
    );

    // ── Fetch source data from GitHub ─────────────────────────────
    const [vRes, tRes, cRes] = await Promise.all([
      fetch(`${GITHUB_RAW}/verse.json`),
      fetch(`${GITHUB_RAW}/translation.json`),
      fetch(`${GITHUB_RAW}/commentary.json`),
    ]);

    if (!vRes.ok || !tRes.ok || !cRes.ok) {
      return NextResponse.json(
        { error: `GitHub fetch failed: verse=${vRes.status} trans=${tRes.status} comm=${cRes.status}` },
        { status: 502 },
      );
    }

    const [verses, allTranslations, allCommentaries]: [GVerse[], GTranslation[], GCommentary[]] =
      await Promise.all([vRes.json(), tRes.json(), cRes.json()]);

    // ── Build lookup maps (Sivananda only) ────────────────────────
    const transMap = new Map<number, string>(
      allTranslations
        .filter(t => t.author_id === SIVANANDA_AUTHOR_ID)
        .map(t => [t.verse_id, t.description]),
    );
    const commMap = new Map<number, string>(
      allCommentaries
        .filter(c => c.author_id === SIVANANDA_AUTHOR_ID)
        .map(c => [c.verse_id, c.description]),
    );

    // ── Build upsert operations ───────────────────────────────────
    let skipped = 0;
    const upserts = verses
      .filter(v => {
        const chapterId = chapterMap.get(v.chapter_number);
        if (!chapterId) { skipped++; return false; }
        return true;
      })
      .map(v => {
        const slug = `${v.chapter_number}-${v.verse_number}`;
        const chapterId = chapterMap.get(v.chapter_number)!;
        const translation = transMap.get(v.id) ?? '';
        const commentary = commMap.get(v.id) ?? null;

        const data = {
          sanskrit: v.text.trim(),
          transliteration: v.transliteration.trim(),
          wordByWord: v.word_meanings ? v.word_meanings.trim() : undefined,
          translation: translation.trim(),
          translationAuthor: 'Swami Sivananda',
          commentary: commentary ? commentary.trim() : null,
          commentaryAuthor: commentary ? 'Swami Sivananda' : null,
        };

        return prisma.verse.upsert({
          where: { slug },
          update: data,
          create: {
            slug,
            chapterId,
            number: v.verse_number,
            globalNumber: v.id,
            ...data,
          },
        });
      });

    // ── Run in batches of 100 to stay within Vercel limits ────────
    const BATCH = 100;
    let seeded = 0;
    for (let i = 0; i < upserts.length; i += BATCH) {
      const batch = upserts.slice(i, i + BATCH);
      await prisma.$transaction(batch);
      seeded += batch.length;
    }

    return NextResponse.json({
      success: true,
      seeded,
      skipped,
      total: verses.length,
      source: 'github.com/gita/gita',
      translation: 'Swami Sivananda (public domain)',
    });
  } catch (err) {
    console.error('[seed-verses]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'POST only' }, { status: 405 });
}
