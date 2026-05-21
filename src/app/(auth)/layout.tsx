import type { ReactNode } from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-saffron-500 via-saffron-600 to-gold-700 flex-col items-center justify-center p-12">
        {/* Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative text-center text-white max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8">
            <Flame className="w-10 h-10 text-white" />
          </div>

          <h1 className="font-serif text-4xl mb-4 leading-tight">
            Ancient Wisdom,<br />
            <span className="italic">Modern Journey</span>
          </h1>

          <p className="font-sanskrit text-2xl text-white/80 mb-3">
            योगस्थः कुरु कर्माणि
          </p>
          <p className="text-white/70 text-sm uppercase tracking-widest mb-8">
            Established in yoga, perform actions
          </p>

          <p className="text-white/80 leading-relaxed text-lg">
            Join thousands of seekers exploring the Bhagavad Gita through immersive reading, guided audio, and a structured learning journey.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 border-t border-white/20 pt-8">
            {[
              { value: '700', label: 'Verses' },
              { value: '18', label: 'Chapters' },
              { value: '5K+', label: 'Seekers' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-serif text-3xl text-white">{value}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl text-dark-900 dark:text-white">Gita Learning</span>
          </Link>
        </div>

        {/* Desktop logo */}
        <div className="hidden lg:block p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl text-dark-900 dark:text-white">Gita Learning</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
