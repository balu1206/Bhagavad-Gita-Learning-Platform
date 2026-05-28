/**
 * Fetches verse data from GitHub and writes SQL batch files.
 * Run from gita-app/: node scripts/seed-export-sql.mjs
 * Output: scripts/sql-batches/batch-000.sql … batch-013.sql  (50 verses each)
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR    = resolve(__dirname, 'sql-batches')
const GITHUB_RAW = 'https://raw.githubusercontent.com/gita/gita/main/data'
const SIVANANDA  = 16
const BATCH      = 50

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

// Escape a value for PostgreSQL string literal
function sq(s) {
  if (s === null || s === undefined) return 'NULL'
  return `'${String(s).replace(/\\/g,"\\\\").replace(/'/g,"''")}'`
}

console.log('📥  Fetching from GitHub...')
const [vR,tR,cR] = await Promise.all([
  fetch(`${GITHUB_RAW}/verse.json`),
  fetch(`${GITHUB_RAW}/translation.json`),
  fetch(`${GITHUB_RAW}/commentary.json`),
])
if (!vR.ok||!tR.ok||!cR.ok) { console.error('❌  GitHub fetch failed'); process.exit(1) }

const [verses,trans,comms] = await Promise.all([vR.json(),tR.json(),cR.json()])
console.log(`✅  ${verses.length} verses · ${trans.length} translations · ${comms.length} commentaries`)

const tMap = new Map(trans.filter(t=>t.author_id===SIVANANDA).map(t=>[t.verse_id,t.description]))
const cMap = new Map(comms.filter(c=>c.author_id===SIVANANDA).map(c=>[c.verse_id,c.description]))
const gMap = buildGlobalMap()

const rows = verses.map(v => {
  const cid = CH[v.chapter_number]; if (!cid) return null
  const slug = `${v.chapter_number}-${v.verse_number}`
  return {
    cid, n: v.verse_number, g: gMap.get(slug)??v.id, slug,
    sk: v.text.trim(),
    tr: v.transliteration.trim(),
    wb: v.word_meanings?.trim()||null,
    tn: (tMap.get(v.id)??'').trim(),
    co: cMap.get(v.id)?.trim()??null,
  }
}).filter(Boolean)

console.log(`📝  Building SQL batches for ${rows.length} verses...`)
mkdirSync(OUT_DIR, { recursive: true })

const SUFFIX = `ON CONFLICT (slug) DO UPDATE SET
  sanskrit='||EXCLUDED.sanskrit, transliteration=EXCLUDED.transliteration,
  "wordByWord"=EXCLUDED."wordByWord", translation=EXCLUDED.translation,
  "translationAuthor"=EXCLUDED."translationAuthor",
  commentary=EXCLUDED.commentary, "commentaryAuthor"=EXCLUDED."commentaryAuthor",
  "updatedAt"=now();`

const ON_CONFLICT = `ON CONFLICT (slug) DO UPDATE SET
  sanskrit            = EXCLUDED.sanskrit,
  transliteration     = EXCLUDED.transliteration,
  "wordByWord"        = EXCLUDED."wordByWord",
  translation         = EXCLUDED.translation,
  "translationAuthor" = EXCLUDED."translationAuthor",
  commentary          = EXCLUDED.commentary,
  "commentaryAuthor"  = EXCLUDED."commentaryAuthor",
  "updatedAt"         = now()`

let b = 0
for (let i=0; i<rows.length; i+=BATCH) {
  const batch = rows.slice(i, i+BATCH)
  const vals  = batch.map(r => {
    // wordByWord is a Json? column — must cast to json via to_json()
    const wb = r.wb ? `to_json(${sq(r.wb)}::text)` : 'NULL'
    return `(gen_random_uuid(),${sq(r.cid)},${r.n},${r.g},${sq(r.slug)},${sq(r.sk)},${sq(r.tr)},${wb},${sq(r.tn)},'Swami Sivananda',${sq(r.co)},${r.co?`'Swami Sivananda'`:'NULL'},now(),now())`
  }).join(',\n')

  const sql = `-- Batch ${b} (verses ${i+1}-${Math.min(i+BATCH,rows.length)})\n`+
    `INSERT INTO "Verse" (id,"chapterId",number,"globalNumber",slug,sanskrit,transliteration,"wordByWord",translation,"translationAuthor",commentary,"commentaryAuthor","createdAt","updatedAt")\nVALUES\n${vals}\n${ON_CONFLICT};`

  writeFileSync(resolve(OUT_DIR, `batch-${String(b).padStart(3,'0')}.sql`), sql)
  b++
}

console.log(`\n✅  ${b} batch files written to scripts/sql-batches/`)
console.log('   Claude will now execute them via Supabase MCP.')
