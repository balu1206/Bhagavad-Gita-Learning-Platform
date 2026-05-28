/**
 * Admin endpoint to seed Bhagavad Gita content.
 * Step 1: POST { secret, step: "chapters" }
 * Step 2: POST { secret, step: "verses", from: 1, to: 9 }
 * Step 3: POST { secret, step: "verses", from: 10, to: 18 }
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

const SEED_SECRET  = 'gita-2026-seed-unlock';
const SIVANANDA_ID = 16;
const GITHUB_RAW   = 'https://raw.githubusercontent.com/gita/gita/main/data';

const CHAPTERS = [
  { n: 1,  verseCount: 47,  title: 'Arjuna Vishada Yoga' },
  { n: 2,  verseCount: 72,  title: 'Sankhya Yoga' },
  { n: 3,  verseCount: 43,  title: 'Karma Yoga' },
  { n: 4,  verseCount: 42,  title: 'Jnana Karma Sanyasa Yoga' },
  { n: 5,  verseCount: 29,  title: 'Karma Sanyasa Yoga' },
  { n: 6,  verseCount: 47,  title: 'Dhyana Yoga' },
  { n: 7,  verseCount: 30,  title: 'Gyana Vigyana Yoga' },
  { n: 8,  verseCount: 28,  title: 'Aksara Brahma Yoga' },
  { n: 9,  verseCount: 34,  title: 'Raja Vidya Raja Guhya Yoga' },
  { n: 10, verseCount: 42,  title: 'Vibhuti Yoga' },
  { n: 11, verseCount: 55,  title: 'Vishvarupa Darshana Yoga' },
  { n: 12, verseCount: 20,  title: 'Bhakti Yoga' },
  { n: 13, verseCount: 35,  title: 'Kshetra Kshetrajna Vibhaga Yoga' },
  { n: 14, verseCount: 27,  title: 'Gunatraya Vibhaga Yoga' },
  { n: 15, verseCount: 20,  title: 'Purushottama Yoga' },
  { n: 16, verseCount: 24,  title: 'Daivasura Sampad Vibhaga Yoga' },
  { n: 17, verseCount: 28,  title: 'Shraddhatraya Vibhaga Yoga' },
  { n: 18, verseCount: 78,  title: 'Moksha Sanyasa Yoga' },
];

function buildGlobalMap(): Map<string, number> {
  const m = new Map<string, number>();
  let g = 1;
  for (const ch of CHAPTERS) for (let v = 1; v <= ch.verseCount; v++) m.set(`${ch.n}-${v}`, g++);
  return m;
}

/**
 * Parse word_meanings string into a JSON array of {word, meaning} pairs.
 * Returns null if empty or unparseable.
 */
function parseWordMeanings(raw: string | null | undefined): { word: string; meaning: string }[] | null {
  if (!raw?.trim()) return null;
  try {
    const lines = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const result: { word: string; meaning: string }[] = [];
    for (const line of lines) {
      const match = line.match(/^(.+?)\s*[-–:]\s*(.+)$/);
      if (match) result.push({ word: match[1].trim(), meaning: match[2].trim() });
    }
    return result.length > 0 ? result : null;
  } catch {
    return null;
  }
}

interface GVerse       { id: number; chapter_number: number; verse_number: number; text: string; transliteration: string; word_meanings: string; }
interface GTranslation { verse_id: number; author_id: number; description: string; }
interface GCommentary  { verse_id: number; author_id: number; description: string; }

export async function POST(req: NextRequest) {
  let body: { secret?: string; step?: string; from?: number; to?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (body.secret !== SEED_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const step = body.step ?? 'chapters';

  // ── Step 1: Seed chapters ──────────────────────────────────────────────────
  if (step === 'chapters') {
    for (const ch of CHAPTERS) {
      const slug = `chapter-${ch.n}-${ch.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      await prisma.chapter.upsert({
        where:  { number: ch.n },
        update: { verseCount: ch.verseCount },
        create: {
          number: ch.n, slug, title: ch.title,
          titleSanskrit: '', transliteration: '',
          summary: `${ch.title} — Chapter ${ch.n}.`,
          verseCount: ch.verseCount,
        },
      });
    }
    return NextResponse.json({ success: true, step: 'chapters', seeded: CHAPTERS.length });
  }

  // ── Step 2/3: Seed verses (bulk createMany) ───────────────────────────────
  if (step === 'verses') {
    const from = body.from ?? 1;
    const to   = body.to   ?? 18;

    const dbChapters = await prisma.chapter.findMany({ select: { id: true, number: true } });
    if (!dbChapters.length) return NextResponse.json({ error: 'Run step=chapters first' }, { status: 400 });
    const chMap = new Map<number, string>(dbChapters.map((c: { id: string; number: number }) => [c.number, c.id]));
    const gMap  = buildGlobalMap();

    // Fetch all three source files in parallel
    const [vRes, tRes, cRes] = await Promise.all([
      fetch(`${GITHUB_RAW}/verse.json`),
      fetch(`${GITHUB_RAW}/translation.json`),
      fetch(`${GITHUB_RAW}/commentary.json`),
    ]);
    if (!vRes.ok || !tRes.ok || !cRes.ok) {
      return NextResponse.json({ error: 'GitHub fetch failed' }, { status: 502 });
    }

    const [allVerses, allTrans, allComm]: [GVerse[], GTranslation[], GCommentary[]] =
      await Promise.all([vRes.json(), tRes.json(), cRes.json()]);

    const transMap = new Map<number, string>(
      allTrans
        .filter((t: GTranslation) => t.author_id === SIVANANDA_ID)
        .map((t: GTranslation) => [t.verse_id, t.description])
    );
    const commMap = new Map<number, string>(
      allComm
        .filter((c: GCommentary) => c.author_id === SIVANANDA_ID)
        .map((c: GCommentary) => [c.verse_id, c.description])
    );

    // Build rows for this chapter range
    const rows: Prisma.VerseCreateManyInput[] = allVerses
      .filter((v: GVerse) => v.chapter_number >= from && v.chapter_number <= to)
      .flatMap((v: GVerse) => {
        const chapterId = chMap.get(v.chapter_number);
        if (!chapterId) return [];
        const slug         = `${v.chapter_number}-${v.verse_number}`;
        const globalNumber = gMap.get(slug) ?? v.id;
        const translation  = (transMap.get(v.id) ?? '').trim();
        const commentary   = commMap.get(v.id)?.trim() ?? null;
        const parsed       = parseWordMeanings(v.word_meanings);
        const wordByWord   = parsed as Prisma.InputJsonValue | null;
        return [{
          chapterId,
          number:            v.verse_number,
          globalNumber,
          slug,
          sanskrit:          v.text?.trim() ?? '',
          transliteration:   v.transliteration?.trim() ?? '',
          wordByWord:        wordByWord ?? Prisma.DbNull,
          translation,
          translationAuthor: 'Swami Sivananda',
          commentary,
          commentaryAuthor:  commentary ? 'Swami Sivananda' : null,
        }];
      });

    if (!rows.length) {
      return NextResponse.json({ success: true, step: 'verses', range: `${from}-${to}`, seeded: 0 });
    }

    // Delete existing verses in this range first (so re-runs are idempotent),
    // then bulk-insert — faster than 300+ individual upserts.
    const chapterIds = Array.from(
      new Set(
        allVerses
          .filter((v: GVerse) => v.chapter_number >= from && v.chapter_number <= to)
          .map((v: GVerse) => chMap.get(v.chapter_number))
          .filter((id): id is string => !!id)
      )
    );

    await prisma.verse.deleteMany({ where: { chapterId: { in: chapterIds } } });
    const result = await prisma.verse.createMany({ data: rows });

    return NextResponse.json({
      success: true,
      step:    'verses',
      range:   `${from}-${to}`,
      seeded:  result.count,
    });
  }

  return NextResponse.json({ error: 'step must be chapters or verses' }, { status: 400 });
}

export async function GET() {
  return NextResponse.json({ error: 'POST only' }, { status: 405 });
}
