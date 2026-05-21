export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Gita Learning';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const CHAPTERS_COUNT = 18;
export const VERSES_COUNT = 700;

export const READING_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export const FONT_SIZES = ['sm', 'md', 'lg', 'xl'] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const READING_THEMES = ['light', 'sepia', 'dark'] as const;
export type ReadingTheme = (typeof READING_THEMES)[number];

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Read', href: '/chapters', icon: 'BookOpen' },
  { label: 'Listen', href: '/listen', icon: 'Headphones' },
  { label: 'Bookmarks', href: '/bookmarks', icon: 'Bookmark' },
  { label: 'Journey', href: '/journey', icon: 'Map' },
  { label: 'Profile', href: '/profile', icon: 'User' },
] as const;

export const TOAST_DURATION = 4000; // ms
export const DEBOUNCE_DELAY = 300; // ms
export const VERSE_READ_THRESHOLD = 5000; // 5 seconds to count as "read"

export const ACHIEVEMENT_IDS = {
  FIRST_VERSE: 'first_verse',
  FIRST_CHAPTER: 'first_chapter',
  WEEK_STREAK: 'week_streak',
  MONTH_STREAK: 'month_streak',
  ALL_CHAPTERS: 'all_chapters',
  FIRST_BOOKMARK: 'first_bookmark',
  JOURNEY_COMPLETE: 'journey_complete',
} as const;
