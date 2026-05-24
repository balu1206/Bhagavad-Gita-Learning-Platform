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

// Reader (verse) routes own their full-screen chrome via ReadingShell.
// AppShell suppresses its own Header/Sidebar/BottomNav on those pages to
// avoid double-stacking + z-index conflicts.
function isReaderRoute(pathname: string): boolean {
  // Matches /chapters/<n>/<m> where both are numeric (a specific verse)
  return /^\/chapters\/\d+\/\d+(\/|$)/.test(pathname);
}

export function AppShell({ children, title, showHeader = true, className }: AppShellProps) {
  const pathname = usePathname() ?? '';
  const readerMode = isReaderRoute(pathname);

  // In reader mode, render only the children — ReadingShell provides all chrome.
  if (readerMode) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-900">
        <main id="main-content">{children}</main>
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
