'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Logo } from '@/components/shared/Logo';

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
        // DS-006: Backdrop blur applied always for consistent frosted-glass nav
        'fixed top-0 left-0 right-0 z-[1030] transition-all duration-300 backdrop-blur-lg',
        scrolled
          ? 'bg-warm-50/80 dark:bg-dark-900/80 shadow-soft border-b border-warm-100 dark:border-dark-800'
          : 'bg-white/40 dark:bg-dark-900/40',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo — DS-002 / ISSUE-020: Use canonical Logo component */}
          <Link href="/" className="focus-visible:ring-2 focus-visible:ring-saffron-500 rounded-lg focus:outline-none">
            <Logo size="md" />
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
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium text-saffron-700 dark:text-saffron-300 hover:bg-saffron-50 dark:hover:bg-saffron-950/30 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all duration-200"
            >
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
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium text-saffron-700 dark:text-saffron-300 border border-saffron-200 dark:border-saffron-800 hover:bg-saffron-50 dark:hover:bg-saffron-950/30 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-medium hover:shadow-large transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
