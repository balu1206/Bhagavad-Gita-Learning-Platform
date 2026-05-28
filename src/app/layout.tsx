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

const BASE_URL = 'https://bhagavad-gita-learning-platform.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'GitaPath — Read the Bhagavad Gita Online | Sanskrit, Translation & Commentary',
    template: '%s | GitaPath',
  },
  description:
    'Read all 700 verses of the Bhagavad Gita with Sanskrit text, transliteration, English translation and Sivananda commentary. Free, beautiful, and built for modern seekers.',
  keywords: [
    'Bhagavad Gita', 'Gita online', 'read Bhagavad Gita', 'Sanskrit verses',
    'spirituality', 'Hinduism', 'yoga', 'meditation', 'dharma', 'karma',
    'Krishna', 'Arjuna', 'Sivananda', 'BG 2.47', 'shloka', 'verse of the day',
  ],
  authors: [{ name: 'GitaPath' }],
  creator: 'GitaPath',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'GitaPath — Read the Bhagavad Gita Online',
    description: 'All 700 verses with Sanskrit, transliteration, English translation and commentary. Free for everyone.',
    type: 'website',
    url: BASE_URL,
    locale: 'en_US',
    siteName: 'GitaPath',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GitaPath — Ancient Wisdom, Modern Journey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitaPath — Read the Bhagavad Gita Online',
    description: 'All 700 verses, free. Sanskrit · Transliteration · English Translation · Commentary.',
    images: [`${BASE_URL}/og-image.png`],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
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
