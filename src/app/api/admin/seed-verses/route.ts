/**
 * One-time admin endpoint to seed all 18 chapters + 701 Bhagavad Gita verses
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

// ── Static chapter data ───────────────────────────────────────────
const CHAPTERS = [
  { n: 1,  title: 'Arjuna Vishada Yoga',              titleSanskrit: 'अर्जुन विषाद योग',          transliteration: 'Arjuna Viṣāda Yoga',           verseCount: 47 },
  { n: 2,  title: 'Sankhya Yoga',                     titleSanskrit: 'सांख्य योग',                transliteration: 'Sāṅkhya Yoga',                 verseCount: 72 },
  { n: 3,  title: 'Karma Yoga',                       titleSanskrit: 'कर्म योग',                  transliteration: 'Karma Yoga',                   verseCount: 43 },
  { n: 4,  title: 'Jnana Karma Sanyasa Yoga',         titleSanskrit: 'ज्ञान कर्म संन्यास योग',    transliteration: 'Jñāna Karma Sanyāsa Yoga',     verseCount: 42 },
  { n: 5,  title: 'Karma Sanyasa Yoga',               titleSanskrit: 'कर्म संन्यास योग',          transliteration: 'Karma Sanyāsa Yoga',           verseCount: 29 },
  { n: 6,  title: 'Dhyana Yoga',                      titleSanskrit: 'ध्यान योग',                 transliteration: 'Dhyāna Yoga',                  verseCount: 47 },
  { n: 7,  title: 'Gyana Vigyana Yoga',               titleSanskrit: 'ज्ञान विज्ञान योग',         transliteration: 'Jñāna Vijñāna Yoga',           verseCount: 30 },
  { n: 8,  title: 'Aksara Brahma Yoga',               titleSanskrit: 'अक्षर ब्रह्म योग',          transliteration: 'Akṣara Brahma Yoga',           verseCount: 28 },
  { n: 9,  title: 'Raja Vidya Raja Guhya Yoga',       titleSanskrit: 'राज विद्या राज गुह्य योग',  transliteration: 'Rāja Vidyā Rāja Guhya Yoga',  verseCount: 34 },
  { n: 10, title: 'Vibhuti Yoga',                     titleSanskrit: 'विभूति योग',                transliteration: 'Vibhūti Yoga',                 verseCount: 42 },
  { n: 11, title: 'Vishvarupa Darshana Yoga',         titleSanskrit: 'विश्वरूप दर्शन योग',        transliteration: 'Viśvarūpa Darśana Yoga',       verseCount: 55 },
  { n: 12, title: 'Bhakti Yoga',                      titleSanskrit: 'भक्ति योग',                 transliteration: 'Bhakti Yoga',                  verseCount: 20 },
  { n: 13, title: 'Kshetra Kshetrajna Vibhaga Yoga',  titleSanskrit: 'क्षेत्र क्षेत्रज्ञ विभाग योग', transliteration: 'Kṣetra Kṣetrajña Vibhāga Yoga', verseCount: 35 },
  { n: 14, title: 'Gunatraya Vibhaga Yoga',           titleSanskrit: 'गुणत्रय विभाग योग',         transliteration: 'Guṇatraya Vibhāga Yoga',       verseCount: 27 },
  { n: 15, title: 'Purushottama Yoga',                titleSanskrit: 'पुरुषोत्तम योग',            transliteration: 'Puruṣottama Yoga',             verseCount: 20 },
  { n: 16, title: 'Daivasura Sampad Vibhaga Yoga',    titleSanskrit: 'दैवासुर सम्पद् विभाग योग',  transliteration: 'Daivāsura Sampad Vibhāga Yoga', verseCount: 24 },
  { n: 17, title: 'Shraddhatraya Vibhaga Yoga',       titleSanskrit: 'श्रद्धात्रय विभाग योग',     transliteration: 'Śraddhātraya Vibhāga Yoga',    verseCount: 28 },
  { n: 18, title: 'Moksha Sanyasa Yoga',              titleSanskrit: 'मोक्ष संन्यास योग',         transliteration: 'Mokṣa Sanyāsa Yoga',           verseCount: 78 },
];

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
    // ── Step 1: Seed chapters if missing ──────────────────────────
    let globalVerseNumber = 1;
    const chapterMap = new Map<number, string>(); // chapter number → DB id

    for (const ch of CHAPTERS) {
      const slug = `chapter-${ch.n}-${ch.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      const record = await prisma.chapter.upsert({
        where: { number: ch.n },
        update: {},
        create: {
          number: ch.n,
          slug,
          title: ch.title,
          titleSanskrit: ch.titleSanskrit,
          transliteration: ch.transliteration,
          summary: `${ch.title} — one of the 18 chapters of the Bhagavad Gita.`,
          verseCount: ch.verseCount,
        },
      });
      chapterMap.set(ch.n, record.id);
      globalVerseNumber += ch.verseCount;
    }

    // ── Step 2: Fetch verse content from GitHub ────────────────────
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

    // ── Build Sivananda lookup maps ───────────────────────────────
    const transMap = new Map<number, string>(
      allTranslations
        .filter((t: GTranslation) => t.author_id === SIVANANDA_AUTHOR_ID)
        .map((t: GTranslation) => [t.verse_id, t.description]),
    );
    const commMap = new Map<number, string>(
      allCommentaries
        .filter((c: GCommentary) => c.author_id === SIVANANDA_AUTHOR_ID)
        .map((c: GCommentary) => [c.verse_id, c.description]),
    );

    // ── Step 3: Upsert all verses in batches of 100 ───────────────
    let globalNum = 1;
    // build globalNumber map: chapter_number+verse_number → globalNumber
    const globalNumMap = new Map<string, number>();
    for (const ch of CHAPTERS) {
      for (let v = 1; v <= ch.verseCount; v++) {
        globalNumMap.set(`${ch.n}-${v}`, globalNum++);
      }
    }

    let seeded = 0;
    let skipped = 0;
    const BATCH = 50;

    for (let i = 0; i < verses.length; i += BATCH) {
      const batch = verses.slice(i, i + BATCH);
      const ops = batch
        .map((v: GVerse) => {
          const chapterId = chapterMap.get(v.chapter_number);
          if (!chapterId) { skipped++; return null; }
          const slug = `${v.chapter_number}-${v.verse_number}`;
          const gNum = globalNumMap.get(slug) ?? v.id;
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
            create: { slug, chapterId, number: v.verse_number, globalNumber: gNum, ...data },
          });
        })
        .filter(Boolean);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prisma.$transaction(ops as any[]);
      seeded += ops.length;
    }

    return NextResponse.json({
      success: true,
      chapters: CHAPTERS.length,
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
