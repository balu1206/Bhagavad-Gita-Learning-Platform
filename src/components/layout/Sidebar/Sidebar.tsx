'use client';

import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Headphones, Bookmark, Map, User, Settings,
  ChevronLeft, ChevronRight, Flame,
} from 'lucide-react';
import { useState } from 'react';

// DS-001: Settings added to support the canonical 7-item nav
const iconMap = {
  LayoutDashboard, BookOpen, Headphones, Bookmark, Map, User, Settings,
} as const;

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        // DS-007: Sidebar hidden below lg (1024px) — BottomNav takes over
        'hidden lg:flex flex-col h-screen sticky top-0',
        'border-r border-warm-100 dark:border-dark-700',
        'bg-white dark:bg-dark-900',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
        className,
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-warm-100 dark:border-dark-700', collapsed && 'justify-center px-0')}>
        <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Flame className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        {!collapsed && (
          <span className="font-serif font-semibold text-dark-900 dark:text-dark-100 text-base leading-tight">
            Gita<br />Learning
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" aria-label="Sidebar navigation">
        <ul className="flex flex-col gap-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === `/${item.href.replace('/','').split('/')[0]}` ||
              pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                    'transition-colors duration-150',
                    'focus-visible:ring-2 focus-visible:ring-saffron-500 focus:outline-none',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-saffron-50 text-saffron-600 dark:bg-saffron-900/20 dark:text-saffron-400'
                      : 'text-dark-600 hover:bg-warm-100 hover:text-dark-900 dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-100',
                  )}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom — ISSUE-013: ThemeToggle removed from sidebar; canonical position is Header (top-right) */}
      <div className={cn('border-t border-warm-100 dark:border-dark-700 p-2 flex items-center', collapsed ? 'flex-col gap-2 py-3' : 'gap-2')}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'ml-auto rounded-lg p-2 text-dark-400 hover:bg-warm-100 hover:text-dark-700',
            'dark:hover:bg-dark-800 dark:hover:text-dark-200 transition-colors',
            collapsed && 'ml-0 w-full flex justify-center',
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
