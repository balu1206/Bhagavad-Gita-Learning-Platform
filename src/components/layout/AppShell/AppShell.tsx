'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../Sidebar';
import { BottomNav } from '../BottomNav';
import { Header } from '../Header';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  className?: string;
}

// Reader / full-screen routes own their own chrome.
// AppShell suppresses its own Header/Sidebar/BottomNav on these pages to
// avoid double-stacking, overflow-auto scroll, and z-index conflicts.
function isReaderRoute(pathname: string): boolean {
  // Specific verse pages: /chapters/<n>/<m>
  if (/^\/chapters\/\d+\/\d+(\/|$)/.test(pathname)) return true;
  // Listen / audio player — needs a true full-screen viewport
  if (pathname.startsWith('/listen')) return true;
  return false;
}

export function AppShell({ children, title, showHeader = true, className }: AppShellProps) {
  const pathname = usePathname() ?? '';
  const readerMode = isReaderRoute(pathname);

  // In reader mode, render only the children — ReadingShell / ListenPage provides all chrome.
  // h-dvh + overflow-hidden ensures true full-screen with no scrollbar bleed.
  if (readerMode) {
    return (
      <div className="h-dvh overflow-hidden bg-dark-950">
        <main id="main-content" className="h-full overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-warm-50 dark:bg-dark-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {showHeader && <Header title={title} />}

        <main
          id="main-content"
          className={cn(
            'flex-1 overflow-auto',
            // DS-007: Bottom nav now shows below lg, so reserve space until lg
            'pb-20 lg:pb-0',
            className,
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
