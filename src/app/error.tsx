'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // ISSUE-014: Surface error details in console with full stack
  useEffect(() => {
    console.error('[App Error]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      name: error.name,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 px-4 text-center dark:bg-dark-950">
      <div className="mb-6 text-5xl">⚡</div>
      <h2 className="mb-2 text-2xl font-bold text-dark-900 dark:text-warm-50">
        Something went wrong
      </h2>
      <p className="mb-2 text-dark-700 dark:text-warm-200">
        Even the steadiest chariot hits a rough patch. Let us try again.
      </p>
      <p className="mb-8 text-sm italic text-dark-600 dark:text-warm-300">
        &ldquo;The soul is never shaken by difficulties.&rdquo; — Gita 2.23 (paraphrased)
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-6 py-3 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 hover:bg-warm-100 dark:border-dark-700 dark:text-warm-400 transition-all"
        >
          Go home
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-xs text-warm-300">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
