'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-32 lg:py-40 bg-cream-50 dark:bg-dark-950">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        {/* Double-bezel CTA container */}
        <div ref={ref} className="reveal bezel-card overflow-hidden">
          <div className="bezel-core relative overflow-hidden px-8 py-16 sm:px-16 sm:py-20 lg:py-24 text-center">

            {/* Ambient glow */}
            <div aria-hidden className="absolute inset-0 bg-gradient-warm-radial opacity-80 dark:opacity-40" />

            <div className="relative z-10">
              <div className="eyebrow mb-8 mx-auto w-fit">Start your journey</div>

              <p className="font-sanskrit text-3xl text-saffron-500 dark:text-saffron-400 mb-4">
                ॐ तत् सत्
              </p>

              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-dark-900 dark:text-cream-100 leading-[1.0] tracking-[-0.03em] mb-6 text-balance mx-auto max-w-2xl">
                Begin reading the Gita today
              </h2>

              <p className="text-dark-500 dark:text-dark-400 text-lg font-light mb-12 max-w-lg mx-auto leading-relaxed">
                Free for everyone. No subscription. No ads. Just the ancient wisdom, designed for clarity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
                  Create free account
                  <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center ml-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
                <Link href="/chapters" className="text-sm font-medium text-dark-500 dark:text-dark-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
                  Or browse without an account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
