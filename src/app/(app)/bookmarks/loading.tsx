export default function BookmarksLoading() {
  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl animate-pulse px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-36 rounded-xl bg-warm-200 dark:bg-dark-700" />
          <div className="h-8 w-16 rounded-xl bg-warm-200 dark:bg-dark-700" />
        </div>
        {/* Search bar */}
        <div className="mb-4 h-11 rounded-xl bg-warm-200 dark:bg-dark-700" />
        {/* Filter pills */}
        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-warm-200 dark:bg-dark-700" />
          ))}
        </div>
        {/* Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-warm-200 dark:bg-dark-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
