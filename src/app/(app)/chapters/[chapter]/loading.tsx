// ISSUE-016: Skeleton for individual chapter page
export default function ChapterLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-4 w-32 rounded bg-warm-100 dark:bg-dark-800 animate-pulse mb-3" />
        <div className="h-6 w-40 rounded bg-warm-100 dark:bg-dark-800 animate-pulse mb-2" />
        <div className="h-10 w-72 rounded bg-warm-100 dark:bg-dark-800 animate-pulse mb-3" />
        <div className="h-5 w-full max-w-xl rounded bg-warm-100 dark:bg-dark-800 animate-pulse mb-6" />
        <div className="flex gap-3">
          <div className="h-10 w-40 rounded-xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
        </div>
      </div>

      {/* Verse list */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
