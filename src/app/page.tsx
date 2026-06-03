import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { VerseOfTheDay } from '@/components/landing/VerseOfTheDay';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ChapterPreview } from '@/components/landing/ChapterPreview';
import { JourneySection } from '@/components/landing/JourneySection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <LandingNav />
      <main>
        <HeroSection />
        {/* Verse of the Day sits between the hero stats bar and features */}
        <VerseOfTheDay />
        <FeaturesSection />
        {/* Live chapter preview shows the actual reading experience */}
        <ChapterPreview />
        <JourneySection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
