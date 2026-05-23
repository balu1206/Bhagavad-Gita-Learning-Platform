import type { AudioTrack } from '@/stores/audioStore';

export function getAudioTrack(chapter: number, verse: number): AudioTrack {
  return {
    id: `${chapter}-${verse}`,
    chapter,
    verse,
    chapterTitle: CHAPTER_TITLES[chapter] ?? `Chapter ${chapter}`,
    label: `Chapter ${chapter}, Verse ${verse}`,
    audioUrl: `[placeholder — /audio/gita/${chapter}/${verse}.mp3]`,
  };
}

export function getChapterQueue(chapter: number, startVerse = 1): AudioTrack[] {
  const count = CHAPTER_VERSE_COUNTS[chapter] ?? 0;
  return Array.from({ length: count - startVerse + 1 }, (_, i) =>
    getAudioTrack(chapter, startVerse + i),
  );
}

export const CHAPTER_TITLES: Record<number, string> = {
  1: 'Arjuna Vishada Yoga',        2: 'Sankhya Yoga',
  3: 'Karma Yoga',                 4: 'Jnana Karma Sanyasa Yoga',
  5: 'Karma Sanyasa Yoga',         6: 'Dhyana Yoga',
  7: 'Gyana Vigyana Yoga',         8: 'Aksara Brahma Yoga',
  9: 'Raja Vidya Raja Guhya Yoga', 10: 'Vibhuti Yoga',
  11: 'Vishvarupa Darshana Yoga',  12: 'Bhakti Yoga',
  13: 'Kshetra Kshetrajna Yoga',   14: 'Gunatraya Vibhaga Yoga',
  15: 'Purushottama Yoga',         16: 'Daivasura Sampad Yoga',
  17: 'Shraddhatraya Vibhaga Yoga', 18: 'Moksha Sanyasa Yoga',
};

export const CHAPTER_VERSE_COUNTS: Record<number, number> = {
  1:47,  2:72,  3:43,  4:42,  5:29,
  6:47,  7:30,  8:28,  9:34,  10:42,
  11:55, 12:20, 13:35, 14:27, 15:20,
  16:24, 17:28, 18:78,
};
