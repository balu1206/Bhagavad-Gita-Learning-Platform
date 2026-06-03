'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const features = [
  {
    id: 'reading',
    eyebrow: 'Core experience',
    title: 'Immersive verse reading',
    desc: 'Sanskrit Devanagari, transliteration, word-by-word meanings, and Sivananda commentary all in one beautifully composed layout.',
    col: 'lg:col-span-2',
    accent: 'from-saffron-400 to-gold-400',
    devanagari: 'श्रीमद्भगवद्गीता',
  },
  {
    id: 'audio',
    eyebrow: 'Listen',
    title: 'Pre-recorded audio',
    desc: 'Authentic recitations for every verse. Real pause, resume, and seek — not browser speech synthesis.',
    col: 'lg:col-span-1',
    accent: 'from-amber-400 to-saffron-500',
    devanagari: '♪',
  },
  {
    id: 'journey',
    eyebrow: 'Learn',
    title: 'Guided 8-step path',
    desc: 'From Introduction to Liberation. Lessons, quizzes, and milestones for beginners.',
    col: 'lg:col-span-1',
    accent: 'from-gold-400 to-amber-500',
    devanagari: '॰',
  },
  {
    id: 'bookmarks',
    eyebrow: 'Personal',
    title: 'Bookmarks & notes',
    desc: 'Save verses with personal notes and tags. Your own Gita reference library.',
    col: 'lg:col-span-2',
    accent: 'from-saffron-300 to-gold-500',
    devanagari: '❁',
  },
];

export function FeaturesSection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } }),
      { threshold: 0.08 },
    );
    document.querySelectorAll('.feature-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-32 lg:py-40 bg-cream-50 dark:bg-dark-950">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="reveal feature-reveal mb-16 max-w-xl">
          <div className="eyebrow mb-5">Everything you need</div>
          <h2 className="font-display text-5xl sm:text-6xl font-semibold text-dark-900 dark:text-cream-100 leading-[1.05] tracking-tight text-pretty">
            Designed for depth,<br />
            <em className="text-gradient not-italic">not distraction</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.id}
              className={cn('reveal feature-reveal', f.col)}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="bezel-card h-full group cursor-default">
                <div className="bezel-core p-7 lg:p-8 h-full flex flex-col gap-5 transition-all duration-500">
                  <div className={cn(
                    'font-sanskrit text-4xl lg:text-5xl bg-gradient-to-br bg-clip-text text-transparent w-fit',
                    f.accent,
                  )}>
                    {f.devanagari}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron-600 dark:text-saffron-500 mb-2">
                      {f.eyebrow}
                    </p>
                    <h3 className="font-display text-2xl lg:text-3xl font-semibold text-dark-900 dark:text-cream-100 leading-tight tracking-tight mb-3">
                      {f.title}
                    </h3>
                    <p className="text-dark-500 dark:text-dark-400 leading-relaxed text-sm font-light max-w-prose">
                      {f.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-saffron-600 dark:text-saffron-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
