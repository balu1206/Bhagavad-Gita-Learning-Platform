# Audio Generation Documentation

## Current Status

**MVP:** Browser-based recitation via Web Speech API (zero cost, zero setup)  
**Production:** Google Cloud Text-to-Speech (requires setup — see below)

---

## MVP: Web Speech API (Active Now)

The verse pages use the browser's built-in `SpeechSynthesis` API to read Sanskrit text aloud.

**How it works:**
- User clicks **Listen** on any verse page
- Browser speaks the Sanskrit text using available system voices
- Prefers `sa-IN` (Sanskrit) → `hi-IN` (Hindi) → `mr-IN` (Marathi) voices
- Rate set to 0.75× for clarity

**Pros:** Free, instant, no credentials  
**Cons:** Voice quality depends on the user's OS/browser; no lock-screen controls

---

## Production: Google Cloud Text-to-Speech

### Setup (one-time)

1. **Create a Google Cloud project**
   ```
   https://console.cloud.google.com/
   ```

2. **Enable Cloud Text-to-Speech API**
   ```
   https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   ```

3. **Create a service account and download credentials**
   - IAM & Admin → Service Accounts → Create
   - Role: Cloud Text-to-Speech User
   - Download JSON key → save as `gcloud-credentials.json` (do NOT commit)

4. **Add to `.env.local`**
   ```
   GOOGLE_CLOUD_KEY_FILE=./gcloud-credentials.json
   ```

5. **Install dependency**
   ```bash
   npm install @google-cloud/text-to-speech
   ```

6. **Run the generation script**
   ```bash
   node scripts/generate-audio.mjs
   ```

---

### Cost Estimate

| Voice type | Price per 1M chars | Est. total chars | Est. cost |
|------------|-------------------|-----------------|-----------|
| Standard   | $4.00             | ~800,000        | **~$3.20** |
| WaveNet    | $16.00            | ~800,000        | **~$12.80** |
| Neural2    | $16.00            | ~800,000        | **~$12.80** |

**Free tier:** 1 million characters/month for Standard voices (enough for all 701 verses at no cost).

---

### Voice Configuration

```javascript
// Best options for Sanskrit recitation:

// Option 1: Standard (free tier, acceptable quality)
voice: { languageCode: 'hi-IN', name: 'hi-IN-Standard-A', ssmlGender: 'MALE' }

// Option 2: WaveNet (better quality, ~$12 total)
voice: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-B', ssmlGender: 'MALE' }

// Option 3: Sanskrit direct (limited availability)
voice: { languageCode: 'sa-IN', name: 'sa-IN-Standard-A' }
```

---

### Running the Script

```bash
# Generate all 701 verses (reads from database)
node scripts/generate-audio.mjs

# Generate a single chapter (for testing)
node scripts/generate-audio.mjs --chapter 2

# Generate a single verse
node scripts/generate-audio.mjs --chapter 2 --verse 47
```

Output: `public/audio/gita/{chapter}/{verse}.mp3`

After generation, deploy audio files to a CDN (Vercel Blob, Cloudflare R2, or S3) for production.

---

## File Structure

```
public/
  audio/
    gita/
      1/
        1.mp3    ← Chapter 1, Verse 1
        2.mp3
        ...
        47.mp3
      2/
        1.mp3
        ...
      18/
        78.mp3   ← Chapter 18, Verse 78
```

---

## Database Integration

Once audio files are generated, update the `Verse` table:

```sql
UPDATE "Verse" 
SET "audioUrl" = '/audio/gita/' || SPLIT_PART(slug, '-', 1) || '/' || SPLIT_PART(slug, '-', 2) || '.mp3'
WHERE slug IS NOT NULL;
```

Then update `audioManifest.ts` to read from the DB or use the `/audio/gita/{ch}/{v}.mp3` pattern directly.

---

## Alternative Audio Sources

| Source | Quality | Cost | Status |
|--------|---------|------|--------|
| Web Speech API | System TTS | Free | ✅ Active (MVP) |
| Google Cloud TTS | High | ~$3 free | Ready to deploy |
| bhagavadgita.io | Unknown | Free | Not verified |
| archive.org recordings | Authentic | Free | Manual curation needed |
| Bhaktivedanta archives | Professional | Licensed | Future consideration |
