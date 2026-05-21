import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 px-4 text-center dark:bg-dark-950">
      <div className="mb-6 text-6xl">🪷</div>
      <h1 className="mb-2 text-3xl font-bold text-dark-900 dark:text-warm-50">
        Page not found
      </h1>
      <p className="mb-2 text-warm-500">
        As Krishna says in Chapter 2, some things simply do not exist.
      </p>
      <p className="mb-8 text-sm italic text-warm-400">
        "That which does not exist can never come to be." — 2.16
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-6 py-3 text-sm font-medium text-white shadow-medium hover:shadow-large hover:-translate-y-0.5 transition-all"
        >
          Go home
        </Link>
        <Link
          href="/chapters"
          className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 hover:bg-warm-100 dark:border-dark-700 dark:text-warm-400 transition-all"
        >
          Browse chapters
        </Link>
      </div>
    </div>
  );
}
