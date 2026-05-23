import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReadingShell } from '@/components/reader/ReadingShell';
import { VerseDisplay } from '@/components/reader/VerseDisplay';

interface PageProps {
  params: { chapter: string; verse: string };
}

// Chapter metadata with correct verse counts
const CHAPTER_META: Record<number, { title: string; verseCount: number }> = {
  1:  { title: 'Arjuna Vishada Yoga',           verseCount: 47 },
  2:  { title: 'Sankhya Yoga',                  verseCount: 72 },
  3:  { title: 'Karma Yoga',                    verseCount: 43 },
  4:  { title: 'Jnana Karma Sanyasa Yoga',      verseCount: 42 },
  5:  { title: 'Karma Sanyasa Yoga',            verseCount: 29 },
  6:  { title: 'Dhyana Yoga',                   verseCount: 47 },
  7:  { title: 'Gyana Vigyana Yoga',            verseCount: 30 },
  8:  { title: 'Aksara Brahma Yoga',            verseCount: 28 },
  9:  { title: 'Raja Vidya Raja Guhya Yoga',    verseCount: 34 },
  10: { title: 'Vibhuti Yoga',                  verseCount: 42 },
  11: { title: 'Vishvarupa Darshana Yoga',      verseCount: 55 },
  12: { title: 'Bhakti Yoga',                   verseCount: 20 },
  13: { title: 'Kshetra Kshetrajna Vibhaga Yoga', verseCount: 34 },
  14: { title: 'Gunatraya Vibhaga Yoga',        verseCount: 27 },
  15: { title: 'Purushottama Yoga',             verseCount: 20 },
  16: { title: 'Daivasura Sampad Vibhaga Yoga', verseCount: 24 },
  17: { title: 'Shraddhatraya Vibhaga Yoga',    verseCount: 28 },
  18: { title: 'Moksha Sanyasa Yoga',           verseCount: 78 },
};

// Placeholder verse data — replaced with DB fetch in Phase 4
function getVerseData(chapter: number, verse: number) {
  const famous: Record<string, {
    sanskrit: string; transliteration: string; translation: string;
    commentary: string | null;
  }> = {
    '2-47': {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
      translation: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
      commentary: 'This is perhaps the most celebrated verse of the Bhagavad Gita. It encapsulates the essence of Karma Yoga — perform your duty with full effort and dedication, but release all attachment to outcomes. The fruit of action belongs to the Divine; your role is to act rightly.\n\nThree prohibitions are stated: do not claim ownership of results, do not make results your motive, and do not retreat into inaction. All three arise from the same root — identification with the ego as the doer.',
    },
  };

  const meta = CHAPTER_META[chapter];
  const chapterTitle = meta?.title ?? `Chapter ${chapter}`;
  const totalVerses = meta?.verseCount ?? 1;

  const key = `${chapter}-${verse}`;
  if (famous[key]) return { ...famous[key], chapter, verse, chapterTitle, totalVerses };

  // Generic placeholder for verses without content yet
  return {
    chapter, verse, chapterTitle, totalVerses,
    sanskrit: `[Sanskrit text — Chapter ${chapter}, Verse ${verse}]`,
    transliteration: `[Transliteration — ${chapter}.${verse}]`,
    translation: `[Translation placeholder — Chapter ${chapter}, Verse ${verse}. Full content will be added in Phase 4.]`,
    commentary: null,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ch = parseInt(params.chapter);
  const v  = parseInt(params.verse);
  if (isNaN(ch) || isNaN(v)) return {};
  return { title: `Chapter ${ch}, Verse ${v}` };
}

export default function VersePage({ params }: PageProps) {
  const ch = parseInt(params.chapter);
  const v  = parseInt(params.verse);
  if (isNaN(ch) || ch < 1 || ch > 18 || isNaN(v) || v < 1) notFound();

  const verseData = getVerseData(ch, v);

  return (
    <ReadingShell
      chapter={ch}
      verse={v}
      totalVerses={verseData.totalVerses}
      chapterTitle={verseData.chapterTitle}
    >
      <VerseDisplay
        chapter={ch}
        verse={v}
        sanskrit={verseData.sanskrit}
        transliteration={verseData.transliteration}
        translation={verseData.translation}
        commentary={verseData.commentary ?? undefined}
      />
    </ReadingShell>
  );
}
