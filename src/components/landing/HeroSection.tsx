'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function HeroSection() {
  const leftRef  = useReveal();
  const rightRef = useReveal();
  const statsRef = useReveal();

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-cream-50 dark:bg-dark-950">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[700px] h-[700px] rounded-full bg-gradient-saffron-glow opacity-70 dark:opacity-40" />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-saffron-glow opacity-40 dark:opacity-20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div ref={leftRef} className="reveal">
            <div className="eyebrow mb-8">
              <svg className="w-2.5 h-2.5 text-saffron-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
              Ancient wisdom · Modern reading experience
            </div>
            <p className="font-sanskrit text-3xl text-saffron-500 dark:text-saffron-400 mb-4 leading-relaxed">
              योगस्थः कुरु कर्माणि
            </p>
            <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-semibold leading-[0.95] tracking-[-0.03em] text-dark-900 dark:text-cream-100 mb-6 text-pretty">
              The Bhagavad<br />
              <em className="text-gradient not-italic">Gita</em>
            </h1>
            <p className="text-lg text-dark-500 dark:text-dark-400 leading-relaxed max-w-md mb-10 font-light">
              18 chapters. 700 verses. Sanskrit text, transliteration, English translation and Sivananda commentary — beautifully designed for the modern seeker.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="btn-primary text-sm">
                Begin for free
                <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center ml-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
              <Link href="/chapters" className="btn-secondary text-sm">Browse all verses</Link>
            </div>
          </div>

          <div ref={rightRef} className="reveal reveal-delay-2 relative hidden lg:block">
            <div className="relative h-[480px]">
              <div className="absolute inset-x-8 top-8 bezel-card rotate-[2deg] opacity-40">
                <div className="bezel-core p-6">
                  <p className="font-sanskrit text-lg text-saffron-400 mb-2">|| 2.19 ||</p>
                  <p className="font-display text-sm text-dark-500 dark:text-dark-400 italic">Neither the one who thinks of this as a killer nor the one...</p>
                </div>
              </div>
              <div className="absolute inset-x-4 top-4 bezel-card rotate-[-1.5deg] opacity-65">
                <div className="bezel-core p-6">
                  <p className="font-sanskrit text-lg text-saffron-400 mb-2">|| 2.47 ||</p>
                  <p className="font-display text-base text-dark-600 dark:text-dark-300 italic leading-snug">
                    You have a right to perform your duties, but you are not entitled to the fruits...
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bezel-card shadow-xl">
                <div className="bezel-core p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <span className="eyebrow text-[9px]">Chapter 2 · Verse 20</span>
                    <span className="text-xs text-dark-400 dark:text-dark-500 tabular">BG 2.20</span>
                  </div>
                  <p className="font-sanskrit text-2xl text-dark-800 dark:text-cream-200 leading-loose mb-4 text-center">
                    न जायते म्रियते वा कदाचित्
                  </p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 italic text-center mb-5">
                    na jayate mriyate va kadacin
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-saffron-200 dark:via-saffron-800/50 to-transparent mb-5" />
                  <p className="font-display text-base italic text-dark-700 dark:text-dark-200 leading-relaxed flex-1">
                    &ldquo;The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being.&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-px flex-1 bg-warm-200 dark:bg-dark-700" />
                    <span className="text-xs text-dark-400 dark:text-dark-500">Swami Sivananda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={statsRef} className="reveal reveal-delay-3 mt-20 lg:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-px bg-warm-200 dark:bg-dark-800 rounded-2xl overflow-hidden ring-1 ring-warm-200 dark:ring-dark-800">
          {[
            { value: '700', label: 'Verses' },
            { value: '18',  label: 'Chapters' },
            { value: '3',   label: 'Languages' },
            { value: '100%', label: 'Free' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-cream-50 dark:bg-dark-900 px-6 py-5 text-center">
              <p className="font-display text-3xl font-semibold text-gradient tabular mb-1">{value}</p>
              <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
