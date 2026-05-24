/**
 * One-time admin endpoint to seed all 701 Bhagavad Gita verses
 * Source: github.com/gita/gita (Unlicense / public domain)
 * Translation & Commentary: Swami Sivananda (public domain)
 *
 * Usage:
 *   POST /api/admin/seed-verses
 *   Body: { "secret": "gita-2026-seed-unlock" }
 *
 * Runs as a single Prisma transaction — completes in ~2–4 seconds.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const maxDuration = 60; // extend timeout on Vercel

const SEED_SECRET = 'gita-2026-seed-unlock';
const SIVANANDA_AUTHOR_ID = 16;

const GITHUB_RAW = 'https://raw.githubusercontent.com/gita/gita/main/data';

interface GVerse {
  id: number;
  chapter_number: number;
  verse_number: number;
  text: string;            // Sanskrit (Devanagari)
  transliteration: string; // Roman transliteration
  word_meanings: string;   // "word—meaning; word—meaning;"
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

  // ── Fetch source data from GitHub ─────────────────────────────
  try {
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

    // ── Build update operations ───────────────────────────────────
    const updates = verses.map(v => {
      const slug = `${v.chapter_number}-${v.verse_number}`;
      const translation = transMap.get(v.id) ?? '';
      const commentary = commMap.get(v.id) ?? null;

      return prisma.verse.update({
        where: { slug },
        data: {
          sanskrit: v.text.trim(),
          transliteration: v.transliteration.trim(),
          wordByWord: v.word_meanings ? v.word_meanings.trim() : undefined,
          translation: translation.trim(),
          translationAuthor: 'Swami Sivananda',
          commentary: commentary ? commentary.trim() : null,
          commentaryAuthor: commentary ? 'Swami Sivananda' : null,
        },
      });
    });

    // ── Run as single transaction ─────────────────────────────────
    await prisma.$transaction(updates, { timeout: 55_000 });

    return NextResponse.json({
      success: true,
      seeded: updates.length,
      source: 'github.com/gita/gita',
      translation: 'Swami Sivananda (public domain)',
      commentary: 'Swami Sivananda (public domain)',
    });
  } catch (err) {
    console.error('[seed-verses]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: 'POST only' }, { status: 405 });
}
