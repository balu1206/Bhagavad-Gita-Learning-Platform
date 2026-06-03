'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export function LandingNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: '/chapters', label: 'Verses' },
    { href: '/#features', label: 'Features' },
    { href: '/#journey', label: 'Journey' },
  ];

  return (
    <>
      {/* Floating glass pill nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
        <nav className={cn(
          'glass-pill flex items-center gap-4 px-5 py-2.5 rounded-full',
          'transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
          scrolled ? 'shadow-[0_8px_32px_rgba(180,100,0,0.14)]' : '',
        )}>
          {/* Logo */}
          <Link href="/" className="font-display text-lg font-semibold text-dark-900 dark:text-cream-100 tracking-tight hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors duration-300 mr-2">
            GitaPath
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-cream-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-300">
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {session ? (
              <Link href="/chapters" className="btn-primary !text-xs !px-4 !py-2">
                Continue reading
                <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 transition-colors px-3 py-1.5">Sign in</Link>
                <Link href="/register" className="btn-primary !text-xs !px-4 !py-2">
                  Begin free
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 ml-1">
            <span className={cn('w-5 h-px bg-dark-700 dark:bg-cream-300 block origin-center transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]', menuOpen && 'rotate-45 translate-y-[3.5px]')} />
            <span className={cn('w-5 h-px bg-dark-700 dark:bg-cream-300 block origin-center transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]', menuOpen && '-rotate-45 -translate-y-[3.5px]')} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div className={cn(
        'fixed inset-0 z-40 md:hidden backdrop-blur-2xl bg-cream-50/92 dark:bg-dark-950/92',
        'flex flex-col items-center justify-center gap-8',
        'transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}>
        {navLinks.map((l, i) => (
          <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: menuOpen ? `${(i + 1) * 80}ms` : '0ms' }}
            className={cn(
              'font-display text-4xl font-medium text-dark-900 dark:text-cream-100 tracking-tight',
              'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
            )}>
            {l.label}
          </Link>
        ))}
        <div className="flex flex-col items-center gap-3 mt-4">
          <Link href="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>
            Begin for free
          </Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}
            className="text-sm text-dark-400 hover:text-saffron-600 transition-colors">
            Sign in instead
          </Link>
        </div>
      </div>
    </>
  );
}
