/**
 * Local verse seed script — runs directly on your machine, no Vercel timeout.
 *
 * Usage (from gita-app/ directory):
 *   node scripts/seed-gita.mjs
 *
 * Requires .env.local with DATABASE_URL and DIRECT_URL set.
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local (no dotenv dependency needed) ────────────────────────────
function loadEnv(fp) {
  try {
    readFileSync(fp, 'utf8').split('\n').forEach(line => {
      line = line.trim()
      if (!line || line.startsWith('#')) return
      const i = line.indexOf('=')
      if (i < 0) return
      const k = line.slice(0, i).trim()
      let v = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
      if (!process.env[k]) process.env[k] = v
    })
  } catch {}
}

loadEnv(resolve(__dirname, '../.env.local'))
loadEnv(resolve(__dirname, '../.env'))

// Prefer DIRECT_URL for seeding (bypasses PgBouncer pooler)
if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL
}

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL not found — make sure .env.local exists in gita-app/')
  process.exit(1)
}

console.log('✅  Loaded DATABASE_URL')

// ── Constants ────────────────────────────────────────────────────────────────
const GITHUB_RAW   = 'https://raw.githubusercontent.com/gita/gita/main/data'
const SIVANANDA_ID = 16
const BATCH_SIZE   = 100   // rows per SQL statement — keeps param count low

const CHAPTERS = [
  { n:  1, verseCount: 47 }, { n:  2, verseCount: 72 }, { n:  3, verseCount: 43 },
  { n:  4, verseCount: 42 }, { n:  5, verseCount: 29 }, { n:  6, verseCount: 47 },
  { n:  7, verseCount: 30 }, { n:  8, verseCount: 28 }, { n:  9, verseCount: 34 },
  { n: 10, verseCount: 42 }, { n: 11, verseCount: 55 }, { n: 12, verseCount: 20 },
  { n: 13, verseCount: 35 }, { n: 14, verseCount: 27 }, { n: 15, verseCount: 20 },
  { n: 16, verseCount: 24 }, { n: 17, verseCount: 28 }, { n: 18, verseCount: 78 },
]

function buildGlobalMap() {
  const m = new Map(); let g = 1
  for (const ch of CHAPTERS) for (let v = 1; v <= ch.verseCount; v++) m.set(`${ch.n}-${v}`, g++)
  return m
}

// ── Fetch GitHub data ────────────────────────────────────────────────────────
console.log('📥  Fetching verse data from GitHub (this may take 10–20s)...')

const [vRes, tRes, cRes] = await Promise.all([
  fetch(`${GITHUB_RAW}/verse.json`),
  fetch(`${GITHUB_RAW}/translation.json`),
  fetch(`${GITHUB_RAW}/commentary.json`),
])

if (!vRes.ok || !tRes.ok || !cRes.ok) {
  console.error(`❌  GitHub fetch failed: ${vRes.status} / ${tRes.status} / ${cRes.status}`)
  process.exit(1)
}

const [allVerses, allTrans, allComm] = await Promise.all([vRes.json(), tRes.json(), cRes.json()])
console.log(`✅  Fetched ${allVerses.length} verses · ${allTrans.length} translations · ${allComm.length} commentaries`)

const transMap = new Map(
  allTrans.filter(t => t.author_id === SIVANANDA_ID).map(t => [t.verse_id, t.description])
)
const commMap = new Map(
  allComm.filter(c => c.author_id === SIVANANDA_ID).map(c => [c.verse_id, c.description])
)
console.log(`✅  Sivananda: ${transMap.size} translations · ${commMap.size} commentaries`)

// ── Connect to Prisma ────────────────────────────────────────────────────────
const { PrismaClient, Prisma } = await import('@prisma/client')
const prisma = new PrismaClient()

const dbChapters = await prisma.chapter.findMany({ select: { id: true, number: true } })
if (!dbChapters.length) {
  console.error('❌  No chapters in DB. Run the chapter seed step first via the API.')
  await prisma.$disconnect(); process.exit(1)
}
const chMap = new Map(dbChapters.map(c => [c.number, c.id]))
const gMap  = buildGlobalMap()
console.log(`✅  ${dbChapters.length} chapters loaded from DB\n`)

// ── Build rows ───────────────────────────────────────────────────────────────
const rows = allVerses.map(v => {
  const chapterId = chMap.get(v.chapter_number)
  if (!chapterId) return null
  const slug = `${v.chapter_number}-${v.verse_number}`
  return {
    chapterId,
    number:       v.verse_number,
    globalNumber: gMap.get(slug) ?? v.id,
    slug,
    sanskrit:       v.text.trim(),
    transliteration: v.transliteration.trim(),
    wordByWord:     v.word_meanings?.trim() || null,
    translation:    (transMap.get(v.id) ?? '').trim(),
    commentary:     commMap.get(v.id)?.trim() ?? null,
  }
}).filter(Boolean)

console.log(`📝  Seeding ${rows.length} verses in batches of ${BATCH_SIZE}...`)

// ── Bulk upsert in batches ───────────────────────────────────────────────────
let total = 0
const batches = Math.ceil(rows.length / BATCH_SIZE)

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE)
  const batchNum = Math.floor(i / BATCH_SIZE) + 1

  await prisma.$executeRaw`
    INSERT INTO "Verse" (
      id, "chapterId", number, "globalNumber", slug,
      sanskrit, transliteration, "wordByWord",
      translation, "translationAuthor",
      commentary, "commentaryAuthor",
      "createdAt", "updatedAt"
    )
    VALUES ${Prisma.join(
      batch.map(r => Prisma.sql`(
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
  `

  total += batch.length
  console.log(`  ✓ Batch ${batchNum}/${batches} — ${total}/${rows.length} verses`)
}

console.log(`\n🎉  Done! ${total} verses seeded successfully.`)
await prisma.$disconnect()
