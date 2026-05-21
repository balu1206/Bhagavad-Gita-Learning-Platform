import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast/Toast';
import { SessionProvider } from '@/components/shared/SessionProvider/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const devanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-sanskrit',
  display: 'swap',
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'GitaPath — Ancient Wisdom, Modern Journey',
    template: '%s | GitaPath',
  },
  description:
    'Explore the Bhagavad Gita through immersive reading, Sanskrit audio, and a guided beginner journey. 700 verses, 18 chapters, 8-step learning path.',
  keywords: [
    'Bhagavad Gita', 'Sanskrit', 'spirituality', 'Hinduism',
    'yoga', 'meditation', 'dharma', 'karma', 'learning', 'Krishna', 'Arjuna',
  ],
  authors: [{ name: 'GitaPath' }],
  creator: 'GitaPath',
  metadataBase: new URL('https://gitapath.vercel.app'),
  openGraph: {
    title: 'GitaPath — Bhagavad Gita Learning',
    description: 'A guided journey through the Bhagavad Gita with Sanskrit audio, bookmarks, and personalised learning paths.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GitaPath',
  },
  twitter: {
    card: 'summary_large_image',
 