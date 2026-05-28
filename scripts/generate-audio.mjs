/**
 * Google Cloud Text-to-Speech audio generator for all 701 Bhagavad Gita verses.
 *
 * SETUP (one-time):
 *   1. Enable Cloud Text-to-Speech API: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
 *   2. Create service account → download JSON key → save as gcloud-credentials.json
 *   3. Add to .env.local: GOOGLE_CLOUD_KEY_FILE=./gcloud-credentials.json
 *   4. npm install @google-cloud/text-to-speech
 *
 * USAGE:
 *   node scripts/generate-audio.mjs              # all 701 verses
 *   node scripts/generate-audio.mjs --chapter 2  # single chapter
 *   node scripts/generate-audio.mjs --chapter 2 --verse 47  # single verse
 *
 * OUTPUT: public/audio/gita/{chapter}/{verse}.mp3
 *
 * COST: Standard voices are FREE up to 1M chars/month.
 *       All 701 verses ≈ 800K chars → $0 on free tier.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load env ──────────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local')
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.+)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

// ── Parse CLI args ────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const chapterArg = args.includes('--chapter') ? parseInt(args[args.indexOf('--chapter') + 1]) : null
const verseArg   = args.includes('--verse')   ? parseInt(args[args.indexOf('--verse')   + 1]) : null

// ── Chapter verse counts ──────────────────────────────────────────────────
const VERSE_COUNTS = [47,72,43,42,29,47,30,28,34,42,55,20,35,27,20,24,28,78]

// ── Fetch Sanskrit text from DB via Supabase REST ─────────────────────────
const SUPABASE_URL = 'https://ydtwllrpwwzzhrfvwkgz.supabase.co'
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdHdsbHJwd3d6emhyZnZ3a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODcwNzAsImV4cCI6MjA5NDc2MzA3MH0.suuzvAUeauHPXpBVSQ_3eAwgHdiOkcUFjj_05xu0XUM'

async function fetchVerseSanskrit(chapter, verse) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/Verse?slug=eq.${chapter}-${verse}&select=sanskrit`,
    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` } }
  )
  if (!res.ok) throw new Error(`Supabase: ${res.status}`)
  const [row] = await res.json()
  if (!row) throw new Error(`Verse ${chapter}.${verse} not found in DB`)
  return row.sanskrit
}

// ── Google Cloud TTS ──────────────────────────────────────────────────────
async function generateAudio(sanskrit, chapter, verse, client) {
  const request = {
    input: { text: sanskrit },
    voice: {
      // hi-IN WaveNet-B gives natural Devanagari pronunciation
      // Change to 'sa-IN-Standard-A' if Sanskrit voice becomes available
      languageCode: 'hi-IN',
      name: 'hi-IN-Wavenet-B',
      ssmlGender: 'MALE',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.80,   // slower = clearer Sanskrit
      pitch: 0.0,
      effectsProfileId: ['headphone-class-device'],
    },
  }

  const [response] = await client.synthesizeSpeech(request)
  const outDir  = resolve(__dirname, `../public/audio/gita/${chapter}`)
  const outFile = resolve(outDir, `${verse}.mp3`)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(outFile, response.audioContent)
  return `/audio/gita/${chapter}/${verse}.mp3`
}

// ── Delay helper ──────────────────────────────────────────────────────────
const delay = (ms) => new Promise(r => setTimeout(r, ms))

// ── Main ──────────────────────────────────────────────────────────────────
const keyFile = process.env.GOOGLE_CLOUD_KEY_FILE
if (!keyFile || !existsSync(resolve(__dirname, '..', keyFile))) {
  console.error(`
❌  Google Cloud credentials not found.

  1. Download your service account JSON key from Google Cloud Console
  2. Save it as: gcloud-credentials.json  (in gita-app root)
  3. Add to .env.local:  GOOGLE_CLOUD_KEY_FILE=./gcloud-credentials.json
  4. Re-run: node scripts/generate-audio.mjs

  See AUDIO_GENERATION.md for full setup instructions.
`)
  process.exit(1)
}

// Dynamic import after credentials check
const { TextToSpeechClient } = await import('@google-cloud/text-to-speech')
const client = new TextToSpeechClient({ keyFilename: resolve(__dirname, '..', keyFile) })

const chapters = chapterArg ? [chapterArg] : Array.from({ length: 18 }, (_, i) => i + 1)

let success = 0, skipped = 0, errors = 0

for (const ch of chapters) {
  const total = VERSE_COUNTS[ch - 1]
  const verses = verseArg ? [verseArg] : Array.from({ length: total }, (_, i) => i + 1)

  console.log(`\n📖  Chapter ${ch} (${verses.length} verses)`)

  for (const v of verses) {
    const outFile = resolve(__dirname, `../public/audio/gita/${ch}/${v}.mp3`)
    if (existsSync(outFile)) {
      process.stdout.write(`·`)
      skipped++
      continue
    }

    try {
      const sanskrit = await fetchVerseSanskrit(ch, v)
      await generateAudio(sanskrit, ch, v, client)
      process.stdout.write(`✓`)
      success++
      await delay(150)  // ~6.6 req/s — well within rate limits
    } catch (err) {
      process.stdout.write(`✗`)
      console.error(`\n  ❌ ${ch}.${v}: ${err.message}`)
      errors++
    }
  }
  console.log()
}

console.log(`
${'─'.repeat(50)}
✅  Done!
   Generated : ${success}
   Skipped   : ${skipped}  (already existed)
   Errors    : ${errors}

Next step: run this SQL to wire audio URLs to the database:

  UPDATE "Verse"
  SET "audioUrl" = '/audio/gita/' || SPLIT_PART(slug,'-',1) || '/' || SPLIT_PART(slug,'-',2) || '.mp3'
  WHERE slug IS NOT NULL;
`)
