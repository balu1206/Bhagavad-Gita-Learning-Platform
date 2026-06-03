'use client';

import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, Bookmark, Map,
  ChevronLeft, ChevronRight, Flame,
} from 'lucide-react';
import { useState } from 'react';

const iconMap = {
  BookOpen, Map, Bookmark,
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
        'hidden lg:flex flex-col h-screen sticky top-0',
        'border-r border-warm-200/60 dark:border-dark-800/60',
        'bg-cream-50 dark:bg-dark-950',
        'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
        collapsed ? 'w-16' : 'w-56',
        className,
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-5 py-5 border-b border-warm-200/60 dark:border-dark-800/60', collapsed && 'justify-center px-0')}>
        <span className="font-sanskrit text-xl text-saffron-500 flex-shrink-0">ॐ</span>
        {!collapsed && (
          <span className="font-display font-semibold text-dark-900 dark:text-cream-100 text-base">
            GitaPath
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
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                    'transition-all duration-300',
                    'focus-visible:ring-2 focus-visible:ring-saffron-400/40 focus:outline-none',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-400'
                      : 'text-dark-500 hover:bg-warm-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-cream-100',
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className={cn('border-t border-warm-200/60 dark:border-dark-800/60 p-2 flex items-center', collapsed ? 'flex-col gap-2 py-3' : 'gap-2')}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'ml-auto rounded-lg p-2 text-dark-400 hover:bg-warm-100 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 transition-colors duration-300',
            collapsed && 'ml-0 w-full flex justify-center',
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
