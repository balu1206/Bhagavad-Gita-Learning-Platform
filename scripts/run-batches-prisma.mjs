/**
 * Executes all SQL batch files via Prisma (uses the same connection as the app).
 * Run from gita-app/: node scripts/run-batches-prisma.mjs
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local so Prisma picks up DATABASE_URL ────────────────────────
const envPath = resolve(__dirname, '../.env.local')
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.+)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

// ── Import Prisma after env is set ─────────────────────────────────────────
const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

const BATCHES_DIR = resolve(__dirname, 'sql-batches')
const files = readdirSync(BATCHES_DIR)
  .filter(f => f.startsWith('batch-') && f.endsWith('.sql'))
  .sort()

console.log(`📦  ${files.length} batch files found\n`)

const [{ total: before }] = await prisma.$queryRaw`SELECT COUNT(*)::int as total FROM "Verse"`
console.log(`📊  Verses in DB before: ${before}\n`)

let totalErrors = 0

for (const file of files) {
  const sql = readFileSync(resolve(BATCHES_DIR, file), 'utf8')
  const verseCount = (sql.match(/gen_random_uuid\(\)/g) || []).length
  process.stdout.write(`  ${file} (${verseCount} verses) ... `)

  try {
    await prisma.$executeRawUnsafe(sql)
    console.log('✅')
  } catch (err) {
    console.log(`❌  ${err.message.slice(0, 150)}`)
    totalErrors++

    // Verse-by-verse recovery
    console.log('     ↳ Attempting verse-by-verse recovery...')
    const header = `INSERT INTO "Verse" (id,"chapterId",number,"globalNumber",slug,sanskrit,transliteration,"wordByWord",translation,"translationAuthor",commentary,"commentaryAuthor","createdAt","updatedAt") VALUES\n`
    const onConflict = `\nON CONFLICT (slug) DO UPDATE SET
  sanskrit            = EXCLUDED.sanskrit,
  transliteration     = EXCLUDED.transliteration,
  "wordByWord"        = EXCLUDED."wordByWord",
  translation         = EXCLUDED.translation,
  "translationAuthor" = EXCLUDED."translationAuthor",
  commentary          = EXCLUDED.commentary,
  "commentaryAuthor"  = EXCLUDED."commentaryAuthor",
  "updatedAt"         = now()`

    const valuesMatch = sql.match(/VALUES\n([\s\S]+?)\nON CONFLICT/)
    if (!valuesMatch) { console.log('     ↳ Cannot parse — skipping'); continue }

    const rows = valuesMatch[1].split(/(?<=\))\s*,\s*\n(?=\()/)
    let ok = 0, fail = 0
    for (const row of rows) {
      try {
        await prisma.$executeRawUnsafe(header + row.trim() + onConflict)
        ok++
      } catch (e2) {
        const slug = row.match(/'(\d+-\d+)'/)?.[1] ?? '?'
        console.log(`       ✗ slug=${slug}: ${e2.message.slice(0, 80)}`)
        fail++
      }
    }
    console.log(`     ↳ Recovered ${ok}, failed ${fail}`)
  }
}

const [{ total: after }] = await prisma.$queryRaw`SELECT COUNT(*)::int as total FROM "Verse"`
await prisma.$disconnect()

console.log(`\n${'─'.repeat(50)}`)
console.log(`   Batch errors  : ${totalErrors}`)
console.log(`   Verses before : ${before}`)
console.log(`   Verses after  : ${after} / 701`)
if (after >= 701) {
  console.log(`\n✅  All 701 verses are in the database!`)
} else {
  console.log(`\n⚠️  Still missing ${701 - after} verses — check errors above.`)
}
