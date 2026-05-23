export default function ChaptersLoading() {
  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-3xl animate-pulse px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-36 rounded-xl bg-warm-200 dark:bg-dark-700" />
          <div className="h-9 w-24 rounded-xl bg-warm-200 dark:bg-dark-700" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-warm-200 p-4 dark:bg-dark-700">
              <div className="h-10 w-10 rounded-xl bg-warm-300 dark:bg-dark-600" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-warm-300 dark:bg-dark-600" />
                <div className="h-3 w-20 rounded bg-warm-300 dark:bg-dark-600" />
                <div className="h-2 w-full rounded-full bg-warm-300 dark:bg-dark-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
