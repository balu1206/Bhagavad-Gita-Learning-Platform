/**
 * Prisma seed script — populates all 18 chapters with metadata
 * and placeholder verses (real content added in Phase 4+).
 *
 * Run: npx prisma db seed
 * Config in package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
 */

// @ts-ignore — PrismaClient generated at deploy time via `prisma generate`
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CHAPTERS = [
  { n: 1,  title: 'Arjuna Vishada Yoga',         titleSanskrit: 'अर्जुन विषाद योग',     transliteration: 'Arjuna Viṣāda Yoga',          verseCount: 47,  summary: 'Arjuna surveys the Kurukshetra battlefield and is overcome with grief and despair at the prospect of fighting his own kinsmen.' },
  { n: 2,  title: 'Sankhya Yoga',                titleSanskrit: 'सांख्य योग',             transliteration: 'Sāṅkhya Yoga',                verseCount: 72,  summary: 'Krishna begins his teachings, explaining the eternal nature of the soul and introducing the concepts of duty, selfless action, and equanimity.' },
  { n: 3,  title: 'Karma Yoga',                  titleSanskrit: 'कर्म योग',               transliteration: 'Karma Yoga',                  verseCount: 43,  summary: 'The yoga of action — Krishna explains why we must act without attachment to results, fulfilling our duties for the greater good.' },
  { n: 4,  title: 'Jnana Karma Sanyasa Yoga',    titleSanskrit: 'ज्ञान कर्म संन्यास योग', transliteration: 'Jñāna Karma Sanyāsa Yoga',    verseCount: 42,  summary: 'Krishna reveals his divine nature and explains the yoga of knowledge — how wisdom and renunciation of the fruits of action lead to liberation.' },
  { n: 5,  title: 'Karma Sanyasa Yoga',          titleSanskrit: 'कर्म संन्यास योग',       transliteration: 'Karma Sanyāsa Yoga',          verseCount: 29,  summary: 'Discussing renunciation versus selfless action, Krishna shows both lead to the same goal — and the disciplined person of wisdom sees unity in all.' },
  { n: 6,  title: 'Dhyana Yoga',                 titleSanskrit: 'ध्यान योग',              transliteration: 'Dhyāna Yoga',                 verseCount: 47,  summary: 'The yoga of meditation — practical instructions for quieting the mind, sitting in stillness, and experiencing the Self within.' },
  { n: 7,  title: 'Gyana Vigyana Yoga',          titleSanskrit: 'ज्ञान विज्ञान योग',      transliteration: 'Jñāna Vijñāna Yoga',          verseCount: 30,  summary: 'Krishna reveals his divine nature — how he is both the manifest world and the transcendent reality beyond it.' },
  { n: 8,  title: 'Aksara Brahma Yoga',          titleSanskrit: 'अक्षर ब्रह्म योग',       transliteration: 'Akṣara Brahma Yoga',          verseCount: 28,  summary: 'The imperishable absolute — understanding the nature of Brahman, the individual self, karma, and how to attain the divine at death.' },
  { n: 9,  title: 'Raja Vidya Raja Guhya Yoga',  titleSanskrit: 'राज विद्या राज गुह्य योग', transliteration: 'Rāja Vidyā Rāja Guhya Yoga', verseCount: 34,  summary: 'The royal knowledge and royal secret — Krishna\'s most direct teaching on devotion, surrender, and the easiest path to divine union.' },
  { n: 10, title: 'Vibhuti Yoga',                titleSanskrit: 'विभूति योग',             transliteration: 'Vibhūti Yoga',                verseCount: 42,  summary: 'The divine manifestations — Krishna describes how his glory permeates all of creation, seen in excellence and brilliance everywhere.' },
  { n: 11, title: 'Vishvarupa Darshana Yoga',    titleSanskrit: 'विश्वरूप दर्शन योग',     transliteration: 'Viśvarūpa Darśana Yoga',      verseCount: 55,  summary: 'The vision of the cosmic form — Krishna grants Arjuna divine vision to behold his infinite, awe-inspiring universal form.' },
  { n: 12, title: 'Bhakti Yoga',                 titleSanskrit: 'भक्ति योग',              transliteration: 'Bhakti Yoga',                 verseCount: 20,  summary: 'The yoga of devotion — Krishna explains that pure love and surrender to him is the highest and most direct path to liberation.' },
  { n: 13, title: 'Kshetra Kshetrajna Vibhaga Yoga', titleSanskrit: 'क्षेत्र क्षेत्रज्ञ विभाग योग', transliteration: 'Kṣetra Kṣetrajña Vibhāga Yoga', verseCount: 35, summary: 'The field and the knower — distinguishing between the body (the field of experience) and the soul (the eternal knower within).' },
  { n: 14, title: 'Gunatraya Vibhaga Yoga',      titleSanskrit: 'गुणत्रय विभाग योग',      transliteration: 'Guṇatraya Vibhāga Yoga',      verseCount: 27,  summary: 'The three qualities of nature — how tamas (inertia), rajas (passion), and sattva (clarity) bind the soul and how to transcend them.' },
  { n: 15, title: 'Purushottama Yoga',           titleSanskrit: 'पुरुषोत्तम योग',         transliteration: 'Puruṣottama Yoga',            verseCount: 20,  summary: 'The supreme person — the metaphor of the cosmic tree and the ultimate teaching on the transcendent divine beyond all creation.' },
  { n: 16, title: 'Daivasura Sampad Vibhaga Yoga', titleSanskrit: 'दैवासुर सम्पद् विभाग योग', transliteration: 'Daivāsura Sampad Vibhāga Yoga', verseCount: 24, summary: 'Divine and demoniac qualities — understanding the qualities that lead to liberation versus bondage, and the importance of scripture.' },
  { n: 17, title: 'Shraddhatraya Vibhaga Yoga',  titleSanskrit: 'श्रद्धात्रय विभाग योग',   transliteration: 'Śraddhātraya Vibhāga Yoga',   verseCount: 28,  summary: 'The three kinds of faith — how our deepest nature shapes what we worship, what we eat, and what we sacrifice.' },
  { n: 18, title: 'Moksha Sanyasa Yoga',         titleSanskrit: 'मोक्ष संन्यास योग',       transliteration: 'Mokṣa Sanyāsa Yoga',          verseCount: 78,  summary: 'The yoga of liberation and renunciation — the grand conclusion, synthesising all teachings and culminating in the call to surrender to the Divine.' },
];

// Famous verses to seed as real content (public domain — Edwin Arnold translation)
const FAMOUS_VERSES: Record<string, { sanskrit: string; transliteration: string; translation: string; commentary?: string }> = {
  '2-47': {
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
    translation: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
    commentary: 'This is perhaps the most celebrated verse of the Bhagavad Gita. It encapsulates the essence of Karma Yoga — perform your duty with full effort and dedication, but release all attachment to outcomes. The fruit of action belongs to the Divine; your role is to act rightly.',
  },
  '4-7': {
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṃ sṛjāmy aham',
    translation: 'Whenever and wherever there is a decline in righteousness, O descendant of Bharata, and a predominant rise of unrighteousness — at that time I manifest myself personally.',
    commentary: 'Krishna here reveals the principle of divine incarnation (avatāra). Whenever dharma — the moral and cosmic order — is overwhelmed by adharma, the Divine manifests to restore balance. This verse offers great comfort: the universe has a self-correcting principle.',
  },
  '11-32': {
    sanskrit: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो\nलोकान्समाहर्तुमिह प्रवृत्तः।',
    transliteration: 'kālo \'smi loka-kṣaya-kṛt pravṛddho\nlokān samāhartum iha pravṛttaḥ',
    translation: 'I am mighty, world-destroying Time, grown old to annihilate the worlds here. Even without you, all the warriors arrayed in the opposing ranks shall cease to exist.',
    commentary: 'One of the most awe-inspiring verses, made famous when J. Robert Oppenheimer quoted it at the first atomic bomb test. Krishna as Time reminds us that events unfold according to cosmic law — our role is to act rightly within that current.',
  },
};

async function main() {
  console.log('🌱 Seeding Bhagavad Gita database...\n');

  let globalVerseNumber = 1;

  for (const ch of CHAPTERS) {
    const slug = `chapter-${ch.n}-${ch.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

    const chapter = await prisma.chapter.upsert({
      where: { number: ch.n },
      update: {},
      create: {
        number: ch.n,
        slug,
        title: ch.title,
        titleSanskrit: ch.titleSanskrit,
        transliteration: ch.transliteration,
        summary: ch.summary,
        verseCount: ch.verseCount,
      },
    });

    for (let v = 1; v <= ch.verseCount; v++) {
      const verseKey = `${ch.n}-${v}`;
      const famous = FAMOUS_VERSES[verseKey];

      await prisma.verse.upsert({
        where: { globalNumber: globalVerseNumber },
        update: {},
        create: {
          chapterId: chapter.id,
          number: v,
          globalNumber: globalVerseNumber,
          slug: verseKey,
          sanskrit: famous?.sanskrit ?? `[Sanskrit text — Chapter ${ch.n}, Verse ${v}]`,
          transliteration: famous?.transliteration ?? `[Transliteration — ${ch.n}.${v}]`,
          translation: famous?.translation ?? `[Translation placeholder — Chapter ${ch.n}, Verse ${v}. Full text to be added in Phase 4.]`,
          commentary: famous?.commentary ?? null,
        },
      });

      globalVerseNumber++;
    }

    console.log(`  ✓ Chapter ${ch.n}: ${ch.title} (${ch.verseCount} verses)`);
  }

  console.log(`\n✅ Seed complete — ${CHAPTERS.length} chapters, ${globalVerseNumber - 1} verses`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
