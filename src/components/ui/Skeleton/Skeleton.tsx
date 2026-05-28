import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  width?: string;
  height?: string;
}

export function Skeleton({ rounded = 'md', width, height, className, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-warm-100 dark:bg-dark-700',
        rounded === 'none' && 'rounded-none',
        rounded === 'sm' && 'rounded',
        rounded === 'md' && 'rounded-lg',
        rounded === 'lg' && 'rounded-xl',
        rounded === 'full' && 'rounded-full',
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-warm-100 dark:border-dark-700 p-6', className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton width="40px" height="40px" rounded="full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton height="0.875rem" className="w-1/3" />
          <Skeleton height="0.75rem" className="w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
