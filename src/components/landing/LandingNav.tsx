'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Flame, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#journey', label: 'Journey' },
    { href: '#testimonials', label: 'Stories' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[1030] transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-soft border-b border-warm-100 dark:border-dark-800'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-saffron-500 rounded-lg focus:outline-none">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Flame className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-serif font-bold text-dark-900 dark:text-dark-100 text-lg">
              Gita Learning
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-dark-600 hover:text-saffron-600 dark:text-dark-300 dark:hover:text-saffron-400 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="btn-ghost h-9 px-4 text-sm rounded-lg inline-flex items-center">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary h-9 px-4 text-sm rounded-lg inline-flex items-center">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="rounded-lg p-2 text-dark-600 hover:bg-warm-100 dark:text-dark-300 dark:hover:bg-dark-800 transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-warm-100 dark:border-dark-800 bg-white dark:bg-dark-900 px-4 py-4 animate-slide-down">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-warm-100 dark:text-dark-200 dark:hover:bg-dark-800 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-warm-100 dark:border-dark-800 flex flex-col gap-2">
              <Link href="/login" className="btn-ghost h-10 px-4 text-sm rounded-lg inline-flex items-center justify-center">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary h-10 px-4 text-sm rounded-lg inline-flex items-center justify-center">
                Get Started Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
