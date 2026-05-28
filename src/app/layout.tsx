import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast/Toast';
import { SessionProvider } from '@/components/shared/SessionProvider/SessionProvider';

// ISSUE-015: All fonts use display:swap + preload to avoid FOIT
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});

const devanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-sanskrit',
  display: 'swap',
  preload: true,
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gita Learning — Ancient Wisdom, Modern Journey',
    template: '%s | Gita Learning',
  },
  description:
    'Explore the Bhagavad Gita through immersive reading, Sanskrit audio, and a guided beginner journey. 700 verses, 18 chapters, 8-step learning path.',
  keywords: [
    'Bhagavad Gita', 'Sanskrit', 'spirituality', 'Hinduism',
    'yoga', 'meditation', 'dharma', 'karma', 'learning', 'Krishna', 'Arjuna',
  ],
  authors: [{ name: 'Gita Learning' }],
  creator: 'Gita Learning',
  metadataBase: new URL('https://bhagavad-gita-learning-platform.vercel.app'),
  openGraph: {
    title: 'Gita Learning — Ancient Wisdom, Modern Journey',
    description: 'A guided journey through the Bhagavad Gita with Sanskrit audio, bookmarks, and personalised learning paths.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Gita Learning',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gita Learning — Ancient Wisdom, Modern Journey',
    description: 'Ancient wisdom, modern journey. 700 verses, Sanskrit audio, guided path.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${devanagari.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
