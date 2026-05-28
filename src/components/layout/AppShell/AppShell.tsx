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

// Two kinds of "no shell" routes:
//
//  'verse'  — verse reader pages (/chapters/<n>/<m>): ReadingShell owns its
//             own header/footer and needs normal document scroll.
//             Wrapper: min-h-screen, no overflow restriction.
//
//  'listen' — listen/audio player (/listen): true full-screen viewport,
//             zero scroll, no sidebar/header.
//             Wrapper: h-dvh + overflow-hidden.
//
type RouteMode = 'verse' | 'listen' | 'app';

function getRouteMode(pathname: string): RouteMode {
  if (/^\/chapters\/\d+\/\d+(\/|$)/.test(pathname)) return 'verse';
  if (pathname.startsWith('/listen')) return 'listen';
  return 'app';
}

export function AppShell({ children, title, showHeader = true, className }: AppShellProps) {
  const pathname = usePathname() ?? '';
  const routeMode = getRouteMode(pathname);

  // ── Listen page: true full-screen, no scroll ─────────────────────────────
  if (routeMode === 'listen') {
    return (
      <div className="h-dvh overflow-hidden bg-dark-950">
        <main id="main-content" className="h-full overflow-hidden">{children}</main>
      </div>
    );
  }

  // ── Verse reader: bare wrapper, ReadingShell handles its own chrome ───────
  // min-h-screen (not h-dvh) so content can scroll freely when expanded.
  if (routeMode === 'verse') {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
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
