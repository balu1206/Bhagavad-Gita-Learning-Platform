/**
 * Admin endpoint to seed Bhagavad Gita content.
 * Uses raw SQL bulk-upsert for speed — completes in ~5s per call.
 *
 * Step 1 — seed 18 chapters:
 *   POST { "secret": "...", "step": "chapters" }
 *
 * Step 2 — seed verses ch 1–9:
 *   POST { "secret": "...", "step": "verses", "from": 1, "to": 9 }
 *
 * Step 3 — seed verses ch 10–18:
 *   POST { "secret": "...", "step": "verses", "from": 10, "to": 18 }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const maxDuration = 60;

const SEED_SECRET  = 'gita-2026-seed-unlock';
const SIVANANDA_ID = 16;
const GITHUB_RAW   = 'https://raw.githubusercontent.com/gita/gita/main/data';

const CHAPTERS = [
  { n: 1,  title: 'Arjuna Vishada Yoga',              titleSanskrit: 'अर्जुन विषाद योग',           transliteration: 'Arjuna Viṣāda Yoga',           verseCount: 47 },
  { n: 2,  title: 'Sankhya Yoga',                     titleSanskrit: 'सांख्य योग',                 transliteration: 'Sāṅkhya Yoga',                 verseCount: 72 },
  { n: 3,  title: 'Karma Yoga',                       titleSanskrit: 'कर्म योग',                   transliteration: 'Karma Yoga',                   verseCount: 43 },
  { n: 4,  title: 'Jnana Karma Sanyasa Yoga',         titleSanskrit: 'ज्ञान कर्म संन्यास योग',     transliteration: 'Jñāna Karma Sanyāsa Yoga',     verseCount: 42 },
  { n: 5,  title: 'Karma Sanyasa Yoga',               titleSanskrit: 'कर्म संन्यास योग',           transliteration: 'Karma Sanyāsa Yoga',           verseCount: 29 },
  { n: 6,  title: 'Dhyana Yoga',                      titleSanskrit: 'ध्यान योग',                  transliteration: 'Dhyāna Yoga',                  verseCount: 47 },
  { n: 7,  title: 'Gyana Vigyana Yoga',               titleSanskrit: 'ज्ञान विज्ञान योग',          transliteration: 'Jñāna Vijñāna Yoga',           verseCount: 30 },
  { n: 8,  title: 'Aksara Brahma Yoga',               titleSanskrit: 'अक्षर ब्रह्म योग',           transliteration: 'Akṣara Brahma Yoga',           verseCount: 28 },
  { n: 9,  title: 'Raja Vidya Raja Guhya Yoga',       titleSanskrit: 'राज विद्या राज गुह्य योग',   transliteration: 'Rāja Vidyā Rāja Guhya Yoga',  verseCount: 34 },
  { n: 10, title: 'Vibhuti Yoga',                     titleSanskrit: 'विभूति योग',                 transliteration: 'Vibhūti Yoga',                 verseCount: 42 },
  { n: 11, title: 'Vishvarupa Darshana Yoga',         titleSanskrit: 'विश्वरूप दर्शन योग',         transliteration: 'Viśvarūpa Darśana Yoga',       verseCount: 55 },
  { n: 12, title: 'Bhakti Yoga',                      titleSanskrit: 'भक्ति योग',                  transliteration: 'Bhakti Yoga',                  verseCount: 20 },
  { n: 13, title: 'Kshetra Kshetrajna Vibhaga Yoga',  titleSanskrit: 'क्षेत्र क्षेत्रज्ञ विभाग योग', transliteration: 'Kṣetra Kṣetrajña Vibhāga Yoga', verseCount: 35 },
  { n: 14, title: 'Gunatraya Vibhaga Yoga',           titleSanskrit: 'गुणत्रय विभाग योग',          transliteration: 'Guṇatraya Vibhāga Yoga',       verseCount: 27 },
  { n: 15, title: 'Purushottama Yoga',                titleSanskrit: 'पुरुषोत्तम योग',             transliteration: 'Puruṣottama Yoga',             verseCount: 20 },
  { n: 16, title: 'Daivasura Sampad Vibhaga Yoga',    titleSanskrit: 'दैवासुर सम्पद् विभाग योग',   transliteration: 'Daivāsura Sampad Vibhāga Yoga', verseCount: 24 },
  { n: 17, title: 'Shraddhatraya Vibhaga Yoga',       titleSanskrit: 'श्रद्धात्रय विभाग योग',      transliteration: 'Śraddhātraya Vibhāga Yoga',    verseCount: 28 },
  { n: 18, title: 'Moksha Sanyasa Yoga',              titleSanskrit: 'मोक्ष संन्यास योग',          transliteration: 'Mokṣa Sanyāsa Yoga',           verseCount: 78 },
];

function buildGlobalMap(): Map<string, number> {
  const m = new Map<string, number>();
  let g = 1;
  for (const ch of CHAPTERS) for (let v = 1; v <= ch.verseCount; v++) m.set(`${ch.n}-${v}`, g++);
  return m;
}

interface GVerse       { id: number; chapter_number: number; verse_number: number; text: string; transliteration: string; word_meanings: string; }
interface GTranslation { verse_id: number; author_id: number; description: string; }
interface GCommentary  { verse_id: number; author_id: number; description: string; }

interface VerseRow {
  chapterId: string;
  number: number;
  globalNumber: number;
  slug: string;
  sanskrit: string;
  transliteration: string;
  wordByWord: string | null;
  translation: string;
  commentary: string | null;
}

export async function POST(req: NextRequest) {
  let body: { secret?: string; step?: string; from?: number; to?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (body.secret !== SEED_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const step = body.step ?? 'chapters';

  // ── STEP 1: seed chapters ─────────────────────────────────────
  if (step === 'chapters') {
    for (const ch of CHAPTERS) {
      const slug = `chapter-${ch.n}-${ch.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      await prisma.chapter.upsert({
        where: { number: ch.n },
        update: { verseCount: ch.verseCount },
        create: { number: ch.n, slug, title: ch.title, titleSanskrit: ch.titleSanskrit, transliteration: ch.transliteration, summary: `${ch.title} — Chapter ${ch.n} of the Bhagavad Gita.`, verseCount: ch.verseCount },
      });
    }
    return NextResponse.json({ success: true, step: 'chapters', seeded: CHAPTERS.length });
  }

  // ── STEP 2/3: seed verses via bulk raw SQL ─────────────────────
  if (step === 'verses') {
    const from = body.from ?? 1;
    const to   = body.to   ?? 18;

    const dbChapters = await prisma.chapter.findMany({ select: { id: true, number: true } });
    if (!dbChapters.length) return NextResponse.json({ error: 'Run step=chapters first' }, { status: 400 });
    const chMap = new Map<number, string>(dbChapters.map((c: { id: string; number: number }) => [c.number, c.id]));
    const gMap  = buildGlobalMap();

    // Fetch GitHub data in parallel
    const [vRes, tRes, cRes] = await Promise.all([
      fetch(`${GITHUB_RAW}/verse.json`),
      fetch(`${GITHUB_RAW}/translation.json`),
      fetch(`${GITHUB_RAW}/commentary.json`),
    ]);
    if (!vRes.ok || !tRes.ok || !cRes.ok) return NextResponse.json({ error: 'GitHub fetch failed' }, { status: 502 });

    const [allVerses, allTrans, allComm]: [GVerse[], GTranslation[], GCommentary[]] =
      await Promise.all([vRes.json(), tRes.json(), cRes.json()]);

    const transMap = new Map<number, string>(
      allTrans.filter((t: GTranslation) => t.author_id === SIVANANDA_ID).map((t: GTranslation) => [t.verse_id, t.description])
    );
    const commMap = new Map<number, string>(
      allComm.filter((c: GCommentary) => c.author_id === SIVANANDA_ID).map((c: GCommentary) => [c.verse_id, c.description])
    );

    // Build rows for the requested chapter range
    const rows: VerseRow[] = allVerses
      .filter((v: GVerse) => v.chapter_number >= from && v.chapter_number <= to)
      .map((v: GVerse) => {
        const chapterId = chMap.get(v.chapter_number);
        if (!chapterId) return null;
        const slug = `${v.chapter_number}-${v.verse_number}`;
        return {
          chapterId,
          number: v.verse_number,
          globalNumber: gMap.get(slug) ?? v.id,
          slug,
          sanskrit: v.text.trim(),
          transliteration: v.transliteration.trim(),
          wordByWord: v.word_meanings?.trim() || null,
          translation: (transMap.get(v.id) ?? '').trim(),
          commentary: commMap.get(v.id)?.trim() ?? null,
        } as VerseRow;
      })
      .filter((r): r is VerseRow => r !== null);

    // Single bulk upsert via raw SQL — far faster than N individual round-trips
    await prisma.$executeRaw`
      INSERT INTO "Verse" (
        id, "chapterId", number, "globalNumber", slug,
        sanskrit, transliteration, "wordByWord",
        translation, "translationAuthor",
        commentary, "commentaryAuthor",
        "createdAt", "updatedAt"
      )
      VALUES ${Prisma.join(
        rows.map(r => Prisma.sql`(
          gen_random_uuid(),
          ${r.chapterId}, ${r.number}, ${r.globalNumber}, ${r.slug},
          ${r.sanskrit}, ${r.transliteration}, ${r.wordByWord},
          ${r.translation}, ${'Swami Sivananda'},
          ${r.commentary}, ${r.commentary ? 'Swami Sivananda' : null},
          now(), now()
        )`)
      )}
      ON CONFLICT (slug) DO UPDATE SET
        sanskrit            = EXCLUDED.sanskrit,
        transliteration     = EXCLUDED.transliteration,
        "wordByWord"        = EXCLUDED."wordByWord",
        translation         = EXCLUDED.translation,
        "translationAuthor" = EXCLUDED."translationAuthor",
        commentary          = EXCLUDED.commentary,
        "commentaryAuthor"  = EXCLUDED."commentaryAuthor",
        "updatedAt"         = now()
    `;

    return NextResponse.json({ success: true, step: 'verses', range: `${from}-${to}`, seeded: rows.length });
  }

  return NextResponse.json({ error: 'step must be "chapters" or "verses"' }, { status: 400 });
}

export async function GET() {
  return NextResponse.json({ error: 'POST only' }, { status: 405 });
}
