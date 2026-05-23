'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// BUG-001: Dashboard-specific error boundary with graceful fallback
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard] Error rendering:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border border-warm-200 bg-white p-8 text-center shadow-soft dark:border-dark-700 dark:bg-dark-800">
        <div className="mb-4 text-5xl">🪔</div>
        <h2 className="mb-2 text-xl font-bold text-dark-900 dark:text-warm-50">
          We couldn&apos;t load your dashboard
        </h2>
        <p className="mb-6 text-sm text-warm-500">
          Something went wrong while preparing your view. This is usually temporary.
        </p>
        {error.digest && (
          <p className="mb-4 text-xs text-warm-400">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 px-5 py-2.5 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
          >
            Try again
          </button>
          <Link
            href="/chapters"
            className="inline-flex items-center justify-center rounded-xl border border-warm-200 px-5 py-2.5 text-sm font-medium text-warm-600 hover:bg-warm-100 dark:border-dark-700 dark:text-warm-400 transition-colors"
          >
            Browse chapters
          </Link>
        </div>
      </div>
    </div>
  );
}
