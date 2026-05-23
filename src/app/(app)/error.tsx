'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App section error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-4xl">🙏</div>
      <h2 className="mb-2 text-xl font-bold text-dark-900 dark:text-warm-50">
        Something went wrong
      </h2>
      <p className="mb-6 text-sm text-warm-500">
        This section could not load. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-saffron-600 transition-colors"
        >
          Retry
        </button>
        <Link
          href="/dashboard"
          className="rounded-xl border border-warm-200 px-5 py-2.5 text-sm text-warm-500 hover:bg-warm-50 dark:border-dark-700 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
