import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 px-4 text-center dark:bg-dark-950">
      <div className="mb-6 text-6xl">🪷</div>
      <h1 className="mb-2 text-3xl font-bold text-dark-900 dark:text-warm-50">
        Page not found
      </h1>
      {/* ISSUE-009: Improved contrast for body text (was warm-500/400, too light) */}
      <p className="mb-2 text-dark-700 dark:text-warm-200">
        As Krishna says in Chapter 2, some things simply do not exist.
      </p>
      <p className="mb-8 text-sm italic text-dark-600 dark:text-warm-300">
        &ldquo;That which does not exist can never come to be.&rdquo; — 2.16
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 px-6 py-3 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
        >
          Go home
        </Link>
        {/* ISSUE-010: Fixed secondary CTA — was white-on-white in light mode */}
        <Link
          href="/chapters"
          className="inline-flex items-center justify-center rounded-xl border-2 border-saffron-500 bg-white px-6 py-3 text-sm font-medium text-saffron-600 hover:bg-saffron-50 dark:bg-dark-850 dark:text-saffron-400 dark:hover:bg-saffron-950/30 transition-colors"
        >
          Browse chapters
        </Link>
      </div>
    </div>
  );
}
