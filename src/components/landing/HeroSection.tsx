'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Headphones, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-saffron-500/10 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gold-500/10 blur-3xl animate-pulse-soft [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-saffron-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-saffron-50 px-4 py-1.5 text-sm font-medium text-saffron-700 dark:border-saffron-800 dark:bg-saffron-900/20 dark:text-saffron-300 mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>700 verses. One timeless wisdom.</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-dark-900 dark:text-dark-50 leading-tight mb-6 animate-slide-up">
          Discover the wisdom
          <br />
          <span className="text-gradient">of Bhagavad Gita</span>
        </h1>

        {/* Sanskrit */}
        <p className="font-sanskrit text-2xl text-saffron-600 dark:text-saffron-400 mb-6 animate-fade-in">
          योगस्थः कुरु कर्माणि
        </p>

        {/* Sub-headline */}
        <p className="mx-auto max-w-2xl text-lg text-dark-500 dark:text-dark-400 leading-relaxed mb-10 animate-fade-in">
          Read all 18 chapters, listen to audio recitations, track your daily practice,
          and follow a guided beginner journey — beautifully designed for the modern seeker.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-slide-up">
          <Link
            href="/register"
            className="btn-primary inline-flex items-center gap-2 h-12 px-8 rounded-xl text-base shadow-glow hover:shadow-glow-lg"
          >
            Begin for Free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/chapters"
            className="btn-ghost inline-flex items-center gap-2 h-12 px-8 rounded-xl text-base"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Browse Verses
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-dark-500 dark:text-dark-400 animate-fade-in">
          {[
            { value: '700', label: 'Verses' },
            { value: '18', label: 'Chapters' },
            { value: '8', label: 'Learning Steps' },
            { value: '100%', label: 'Free to start' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-gradient">{value}</p>
              <p className="text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-in">
          {[
            { icon: BookOpen, text: 'Sanskrit + Translation' },
            { icon: Headphones, text: 'Audio Recitation' },
            { icon: Sparkles, text: 'Daily Streaks' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full border border-warm-100 dark:border-dark-700 bg-white dark:bg-dark-850 px-4 py-2 text-sm text-dark-600 dark:text-dark-300 shadow-soft"
            >
              <Icon className="h-4 w-4 text-saffron-500" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
