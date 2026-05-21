import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';
import { BottomNav } from '../BottomNav';
import { Header } from '../Header';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  className?: string;
}

export function AppShell({ children, title, showHeader = true, className }: AppShellProps) {
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
            'pb-20 md:pb-0', // space for mobile bottom nav
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
