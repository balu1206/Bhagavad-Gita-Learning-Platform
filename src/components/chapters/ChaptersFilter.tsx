'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
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
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Search chapters…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={query ? (
            <button onClick={() => onQueryChange('')} className="text-dark-400 hover:text-dark-600">
              <X className="w-4 h-4" />
            </button>
          ) : undefined}
        />
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              status === opt.value
                ? 'bg-saffron-500 text-white shadow-sm'
                : 'bg-warm-100 text-dark-500 hover:bg-warm-200 dark:bg-dark-800 dark:text-dark-400 dark:hover:bg-dark-700',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Count */}
      {query || status !== 'all' ? (
        <span className="text-sm text-dark-400 dark:text-dark-500 whitespace-nowrap">
          {filteredCount} of {totalCount}
        </span>
      ) : null}
    </div>
  );
}
