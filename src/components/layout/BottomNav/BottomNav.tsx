'use client';

import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Headphones, Bookmark, Map, User, Settings,
} from 'lucide-react';

// DS-001: Settings added so the BottomNav iconMap stays in sync with NAV_ITEMS
const iconMap = { LayoutDashboard, BookOpen, Headphones, Bookmark, Map, User, Settings } as const;

// Show only the most important 5 items on mobile
const MOBILE_NAV = NAV_ITEMS.slice(0, 5);

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        // DS-007: Show bottom nav below the lg breakpoint (1024px) per spec
        'lg:hidden fixed bottom-0 left-0 right-0 z-[1030]',
        'flex border-t border-warm-100 dark:border-dark-700',
        'bg-warm-50/80 dark:bg-dark-900/80 backdrop-blur-lg',
        'safe-area-inset-bottom',
      )}
    >
      {MOBILE_NAV.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const isActive = pathname === item.href || pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1',
              'min-h-[56px] touch-target',
              'transition-colors duration-150',
              'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron-500 focus:outline-none',
              isActive
                ? 'text-saffron-600 dark:text-saffron-400'
                : 'text-dark-400 hover:text-dark-700 dark:text-dark-500 dark:hover:text-dark-200',
            )}
          >
            {Icon && (
              <Icon
                className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')}
                aria-hidden="true"
              />
            )}
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-saffron-500" aria-hidden="true" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
