/**
 * Seeds all 701 Bhagavad Gita verses via Supabase REST API (HTTPS only).
 * No local DB connection required — works from any machine.
 * Run from gita-app/: node scripts/seed-via-rest.mjs
 */

import { randomUUID } from 'node:crypto'

const SUPABASE_URL  = 'https://ydtwllrpwwzzhrfvwkgz.supabase.co'
const ANON_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdHdsbHJwd3d6emhyZnZ3a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODcwNzAsImV4cCI6MjA5NDc2MzA3MH0.suuzvAUeauHPXpBVSQ_3eAwgHdiOkcUFjj_05xu0XUM'
const GITHUB_RAW    = 'https://raw.githubusercontent.com/gita/gita/main/data'
const SIVANANDA     = 16
const BATCH_SIZE    = 20   // verses per POST request

// Chapter IDs already in Supabase DB
const CH = {
   1:'cmpl2bgmw0000u7euc0y2crx0',  2:'cmpl2bi850001u7eu6wpz6gtz',
   3:'cmpl2bjt10002u7eup0zze7nk',  4:'cmpl2bldw0003u7eul6avitqg',
   5:'cmpl2bmyr0004u7eukvoveutq',  6:'cmpl2bojm0005u7eu24zpuax0',
   7:'cmpl2bq4j0006u7eudqf7feii',  8:'cmpl2brpf0007u7euvnhrc3ah',
   9:'cmpl2btgl0008u7euc4l5s8jj', 10:'cmpl2bv1g0009u7eu38y5s294',
  11:'cmpl2bwmb000au7eu6fmf61a0', 12:'cmpl2by76000bu7eurf333imq',
  13:'cmpl2bzs2000cu7eumhtz3as2', 14:'cmpl2c1cx000du7eu40brt9qo',
  15:'cmpl2c2xt000eu7eug2yn3y8a', 16:'cmpl2c4io000fu7eux1phow5m',
  17:'cmpl2c69u000gu7eue6ddd3vp', 18:'cmpl2c7up000hu7euasqrsdtf',
}

const CHAPTERS = [
  {n:1,c:47},{n:2,c:72},{n:3,c:43},{n:4,c:42},{n:5,c:29},{n:6,c:47},
  {n:7,c:30},{n:8,c:28},{n:9,c:34},{n:10,c:42},{n:11,c:55},{n:12,c:20},
  {n:13,c:35},{n:14,c:27},{n:15,c:20},{n:16,c:24},{n:17,c:28},{n:18,c:78},
]

function buildGlobalMap() {
  const m = new Map(); let g = 1
  for (const {n,c} of CHAPTERS) for (let v=1;v<=c;v++) m.set(`${n}-${v}`, g++)
  return m
}

const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates,return=minimal',
}

async function upsertBatch(rows) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/Verse?on_conflict=slug`,
    { method: 'POST', headers, body: JSON.stringify(rows) }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
}

// ── Fetch data from GitHub ─────────────────────────────────────────────────
console.log('📥  Fetching from GitHub...')
const [vR,tR,cR] = await Promise.all([
  fetch(`${GITHUB_RAW}/verse.json`),
  fetch(`${GITHUB_RAW}/translation.json`),
  fetch(`${GITHUB_RAW}/commentary.json`),
])
if (!vR.ok||!tR.ok||!cR.ok) { console.error('❌  GitHub fetch failed'); process.exit(1) }

const [verses,trans,comms] = await Promise.all([vR.json(),tR.json(),cR.json()])
console.log(`✅  ${verses.length} verses · ${trans.length} translations · ${comms.length} commentaries\n`)

const tMap = new Map(trans.filter(t=>t.author_id===SIVANANDA).map(t=>[t.verse_id,t.description]))
const cMap = new Map(comms.filter(c=>c.author_id===SIVANANDA).map(c=>[c.verse_id,c.description]))
const gMap = buildGlobalMap()

const now = new Date().toISOString()

const rows = verses.map(v => {
  const cid = CH[v.chapter_number]; if (!cid) return null
  const slug = `${v.chapter_number}-${v.verse_number}`
  const wb = v.word_meanings?.trim() || null
  const co = cMap.get(v.id)?.trim() ?? null
  return {
    id:               randomUUID(),
    chapterId:        cid,
    number:           v.verse_number,
    globalNumber:     gMap.get(slug) ?? v.id,
    slug,
    sanskrit:         v.text.trim(),
    transliteration:  v.transliteration.trim(),
    wordByWord:       wb,            // JSON column — PostgREST accepts string values
    translation:      (tMap.get(v.id)??'').trim(),
    translationAuthor:'Swami Sivananda',
    commentary:       co,
    commentaryAuthor: co ? 'Swami Sivananda' : null,
    createdAt:        now,
    updatedAt:        now,
  }
}).filter(Boolean)

console.log(`📝  Upserting ${rows.length} verses in batches of ${BATCH_SIZE}...\n`)

let done = 0, errors = 0
for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE)
  const first = batch[0].slug
  const last  = batch[batch.length-1].slug
  process.stdout.write(`  [${first} → ${last}] ... `)
  try {
    await upsertBatch(batch)
    done += batch.length
    console.log(`✅  (${done}/${rows.length})`)
  } catch (err) {
    console.log(`❌  ${err.message}`)
    errors++
    // Retry one-by-one
    for (const row of batch) {
      try {
        await upsertBatch([row])
        done++
      } catch (e2) {
        console.log(`     ✗ ${row.slug}: ${e2.message.slice(0,80)}`)
      }
    }
  }
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`   Verses upserted : ${done} / ${rows.length}`)
console.log(`   Batch errors    : ${errors}`)
if (done >= 701) {
  console.log(`\n✅  All 701 verses are in the database!`)
} else {
  console.log(`\n⚠️  Missing ${701 - done} verses — check errors above.`)
}
