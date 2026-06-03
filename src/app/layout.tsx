import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast/Toast';
import { SessionProvider } from '@/components/shared/SessionProvider/SessionProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800'],
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
  description: 'Read all 700 verses of the Bhagavad Gita with Sanskrit text, transliteration, English translation and Sivananda commentary. Free, beautiful, and built for modern seekers.',
  keywords: ['Bhagavad Gita', 'Gita online', 'read Bhagavad Gita', 'Sanskrit verses', 'spirituality', 'Hinduism', 'yoga', 'meditation', 'dharma', 'karma'],
  authors: [{ name: 'GitaPath' }],
  creator: 'GitaPath',
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'GitaPath — Read the Bhagavad Gita Online',
    description: 'All 700 verses with Sanskrit, transliteration, English translation and commentary. Free for everyone.',
    type: 'website',
    url: BASE_URL,
    locale: 'en_US',
    siteName: 'GitaPath',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'GitaPath' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitaPath — Read the Bhagavad Gita Online',
    description: 'All 700 verses, free. Sanskrit · Transliteration · English Translation · Commentary.',
    images: [`${BASE_URL}/og-image.png`],
  },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${jakarta.variable} ${devanagari.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
