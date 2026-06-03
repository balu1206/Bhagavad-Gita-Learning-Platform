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

type RouteMode = 'verse' | 'listen' | 'app';

function getRouteMode(pathname: string): RouteMode {
  if (/^\/chapters\/\d+\/\d+(\/|$)/.test(pathname)) return 'verse';
  if (pathname.startsWith('/listen')) return 'listen';
  return 'app';
}

export function AppShell({ children, title, showHeader = true, className }: AppShellProps) {
  const pathname = usePathname() ?? '';
  const routeMode = getRouteMode(pathname);

  if (routeMode === 'listen') {
    return (
      <div className="h-dvh overflow-hidden bg-dark-950">
        <main id="main-content" className="h-full overflow-hidden">{children}</main>
      </div>
    );
  }

  if (routeMode === 'verse') {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-dark-950">
        <main id="main-content">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-50 dark:bg-dark-950">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {showHeader && <Header title={title} />}
        <main
          id="main-content"
          className={cn('flex-1 overflow-auto pb-20 lg:pb-0', className)}
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
