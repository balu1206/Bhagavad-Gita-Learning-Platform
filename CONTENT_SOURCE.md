# Content Source Documentation

## Chosen Source: gita/gita (GitHub)

**URL:** https://github.com/gita/gita  
**Raw data:** https://raw.githubusercontent.com/gita/gita/main/data/  
**License:** MIT  
**Attribution required:** Yes (see below)

---

## Why This Source Was Chosen

| Criterion | Result |
|-----------|--------|
| Data completeness | ✅ Sanskrit, transliteration, word-by-word, translation, commentary |
| Data quality | ✅ Well-formatted, accurate Devanagari text |
| License | ✅ MIT (free for any use with attribution) |
| Reliability | ✅ Static GitHub files — no rate limits, no API key |
| Total verses | ✅ All 701 verses across 18 chapters |

---

## Translation Author

**Swami Sivananda** (1887–1963)  
Divine Life Society, Rishikesh, India  
Translation ID: `author_id = 16` in the gita/gita dataset

Swami Sivananda's translation includes:
- Sanskrit text (Devanagari)
- Roman transliteration
- Word-by-word meanings
- English translation
- Detailed commentary

---

## Data Files Used

| File | Contents | Size |
|------|----------|------|
| `verse.json` | Sanskrit text + transliteration + word meanings | ~800KB |
| `translation.json` | All translations by multiple authors | ~2MB |
| `commentary.json` | All commentaries by multiple authors | ~5MB |

---

## Sample Response (Verse 2.47)

```json
{
  "id": 89,
  "chapter_number": 2,
  "verse_number": 47,
  "text": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\n\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।",
  "transliteration": "karmaṇy-evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi",
  "word_meanings": "karmaṇi—in prescribed duties; eva—certainly; adhikāraḥ—right; te—your; mā—never; phaleṣhu—in the fruits; kadāchana—at any time..."
}
```

**Translation (Swami Sivananda):**
> "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."

---

## Attribution

When displaying content, attribute as:

> Translation and commentary by **Swami Sivananda**, Divine Life Society.  
> Sanskrit text sourced from [gita/gita](https://github.com/gita/gita) (MIT license).

This attribution is already implemented in `VerseDisplay.tsx`.

---

## How the Data Was Seeded

1. Generated SQL batch files locally using `scripts/seed-export-sql.mjs`
2. Inserted all 701 verses into Supabase via REST API using `scripts/seed-via-rest.mjs`
3. Verification: `SELECT COUNT(*) FROM "Verse"` → 701 ✅

---

## Limitations

- Only Swami Sivananda's translation is stored (other authors available in the dataset if needed)
- Commentary is verbose for some verses (can be truncated in UI)
- Word-by-word stored as plain text JSON, not structured key-value pairs
