'use client';

import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ title, className }: HeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Seeker';

  return (
    <header
      className={cn(
        // DS-006: Consistent backdrop blur on the app header
        'sticky top-0 z-[1020] flex items-center gap-4 px-4 md:px-6 h-14',
        'border-b border-warm-100 dark:border-dark-700',
        'bg-warm-50/80 dark:bg-dark-900/80 backdrop-blur-lg',
        className,
      )}
    >
      {title && (
        <h1 className="font-serif font-semibold text-dark-900 dark:text-dark-100 text-base truncate flex-1">
          {title}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-1">
        <button
          aria-label="Search"
          className="rounded-lg p-2 text-dark-400 hover:bg-warm-100 hover:text-dark-700 dark:hover:bg-dark-800 dark:hover:text-dark-200 transition-colors focus-visible:ring-2 focus-visible:ring-saffron-500 focus:outline-none"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          aria-label="Notifications"
          className="rounded-lg p-2 text-dark-400 hover:bg-warm-100 hover:text-dark-700 dark:hover:bg-dark-800 dark:hover:text-dark-200 transition-colors focus-visible:ring-2 focus-visible:ring-saffron-500 focus:outline-none"
        >
          <Bell className="h-5 w-5" />
        </button>

        <ThemeToggle />

        <button
          aria-label="Open profile menu"
          className="ml-1 rounded-full focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus:outline-none"
        >
          <Avatar size="sm" name={userName} />
        </button>
      </div>
    </header>
  );
}
