'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron-500 via-saffron-600 to-gold-600" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />

      {/* Floating orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
          Begin Your Journey
          <br />
          <span className="italic">Today</span>
        </h2>

        {/* Sanskrit */}
        <p className="font-sanskrit text-2xl text-white/80 mb-4">
          तमसो मा ज्योतिर्गमय
        </p>
        <p className="text-white/70 mb-8 text-sm uppercase tracking-widest">
          From darkness, lead me to light
        </p>

        {/* Body */}
        <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Begin a daily practice with timeless wisdom — find clarity, purpose, and inner peace through the Bhagavad Gita.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-saffron-600 font-semibold px-8 py-4 rounded-xl shadow-large hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 text-lg"
          >
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/chapters"
            className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-lg"
          >
            Explore the Gita
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-white/60 text-sm">
          No credit card required · Free forever for core features
        </p>
      </div>
    </section>
  );
}
