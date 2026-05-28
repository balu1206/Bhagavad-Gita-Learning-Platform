/**
 * Executes all SQL batch files against Supabase (direct connection, no PgBouncer).
 * Run from gita-app/: node scripts/run-batches.mjs
 *
 * Uses DIRECT_URL to avoid PgBouncer limitations with large queries.
 * Splits each batch file into individual verse statements for reliability.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from 'pg'
const { Client } = pkg

const __dirname = dirname(fileURLToPath(import.meta.url))
const BATCHES_DIR = resolve(__dirname, 'sql-batches')

// PgBouncer pooler (transaction mode) — known to work from user machine
const DATABASE_URL = 'postgresql://postgres.ydtwllrpwwzzhrfvwkgz:p6ytQxf3lxXfVszw@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true'

// Direct Postgres connection (no PgBouncer) — better for large queries
const DIRECT_URL = 'postgresql://postgres:p6ytQxf3lxXfVszw@db.ydtwllrpwwzzhrfvwkgz.supabase.co:5432/postgres'

async function connect(url) {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, statement_timeout: 60000 })
  await client.connect()
  return client
}

let client
try {
  client = await connect(DIRECT_URL)
  console.log('✅  Connected via direct URL\n')
} catch (e) {
  console.log(`⚠️  Direct failed (${e.message}), trying pooler...\n`)
  try {
    client = await connect(DATABASE_URL)
    console.log('✅  Connected via pooler\n')
  } catch (e2) {
    console.error('❌  Both connection methods failed:', e2.message)
    process.exit(1)
  }
}

const files = readdirSync(BATCHES_DIR)
  .filter(f => f.startsWith('batch-') && f.endsWith('.sql'))
  .sort()

console.log(`📦  Found ${files.length} batch files\n`)

// Check current verse count
const { rows: [{ total }] } = await client.query('SELECT COUNT(*)::int as total FROM "Verse"')
console.log(`📊  Current verse count: ${total}\n`)

let totalInserted = 0
let totalErrors = 0

for (const file of files) {
  const sql = readFileSync(resolve(BATCHES_DIR, file), 'utf8')
  const verseCount = (sql.match(/\(gen_random_uuid\(\)/g) || []).length
  process.stdout.write(`  ${file} (${verseCount} verses) ... `)

  try {
    await client.query(sql)
    totalInserted += verseCount
    console.log(`✅`)
  } catch (err) {
    console.log(`❌  ${err.message.slice(0, 120)}`)
    totalErrors++

    // Try individual verse recovery: split on gen_random_uuid and re-run one-by-one
    console.log(`     ↳ Attempting verse-by-verse recovery...`)
    const header = `INSERT INTO "Verse" (id,"chapterId",number,"globalNumber",slug,sanskrit,transliteration,"wordByWord",translation,"translationAuthor",commentary,"commentaryAuthor","createdAt","updatedAt") VALUES\n`
    const conflict = `\nON CONFLICT (slug) DO UPDATE SET
  sanskrit            = EXCLUDED.sanskrit,
  transliteration     = EXCLUDED.transliteration,
  "wordByWord"        = EXCLUDED."wordByWord",
  translation         = EXCLUDED.translation,
  "translationAuthor" = EXCLUDED."translationAuthor",
  commentary          = EXCLUDED.commentary,
  "commentaryAuthor"  = EXCLUDED."commentaryAuthor",
  "updatedAt"         = now()`

    // Extract VALUES section
    const valuesMatch = sql.match(/VALUES\n([\s\S]+?)\nON CONFLICT/)
    if (!valuesMatch) { console.log(`     ↳ Cannot parse — skipping`); continue }

    // Split into individual verse rows by splitting on "),\n("
    const valuesBlock = valuesMatch[1]
    // Each row starts with (gen_random_uuid()
    const rows = valuesBlock.split(/(?<=\))\s*,\s*\n(?=\()/)

    let recovered = 0
    let skipped = 0
    for (const row of rows) {
      const oneSQL = header + row.trim() + conflict
      try {
        await client.query(oneSQL)
        recovered++
      } catch (e2) {
        // Extract slug for identification
        const slugMatch = row.match(/'(\d+-\d+)'/)
        const slug = slugMatch ? slugMatch[1] : '?'
        console.log(`       ✗ slug=${slug}: ${e2.message.slice(0, 80)}`)
        skipped++
      }
    }
    console.log(`     ↳ Recovered ${recovered}, skipped ${skipped}`)
    totalInserted += recovered
  }
}

const { rows: [{ total: finalTotal }] } = await client.query('SELECT COUNT(*)::int as total FROM "Verse"')
await client.end()

console.log(`\n${'─'.repeat(50)}`)
console.log(`🎉  Done!`)
console.log(`   Batches processed : ${files.length}`)
console.log(`   Batch errors      : ${totalErrors}`)
console.log(`   Verses upserted   : ${totalInserted}`)
console.log(`   Final DB count    : ${finalTotal} / 701`)
if (finalTotal < 701) {
  console.log(`\n⚠️  Still missing ${701 - finalTotal} verses — check errors above.`)
} else {
  console.log(`\n✅  All 701 verses are in the database!`)
}
