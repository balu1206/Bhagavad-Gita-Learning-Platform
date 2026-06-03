'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FilterStatus = 'all' | 'not-started' | 'in-progress' | 'complete';

interface ChaptersFilterProps {
  query: string;
  status: FilterStatus;
  onQueryChange: (q: string) => void;
  onStatusChange: (s: FilterStatus) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete',    label: 'Complete' },
];

export function ChaptersFilter({
  query, status, onQueryChange, onStatusChange, totalCount, filteredCount,
}: ChaptersFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search chapters..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-warm-100 dark:bg-dark-800 border border-warm-200 dark:border-dark-700 text-sm text-dark-800 dark:text-cream-100 placeholder:text-dark-400 dark:placeholder:text-dark-600 focus:outline-none focus:ring-2 focus:ring-saffron-400/40 transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              'px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300',
              status === opt.value
                ? 'bg-saffron-500 text-white shadow-sm'
                : 'bg-warm-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 hover:bg-warm-200 dark:hover:bg-dark-700 border border-warm-200 dark:border-dark-700',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {(query || status !== 'all') && (
        <span className="text-xs text-dark-400 dark:text-dark-500 whitespace-nowrap tabular">
          {filteredCount} of {totalCount}
        </span>
      )}
    </div>
  );
}
