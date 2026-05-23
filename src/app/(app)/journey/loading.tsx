export default function JourneyLoading() {
  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl animate-pulse px-4">
        <div className="mb-6 h-8 w-44 rounded-xl bg-warm-200 dark:bg-dark-700" />
        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-warm-200 dark:bg-dark-700" />
          ))}
        </div>
        {/* Steps */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-warm-200 dark:bg-dark-700" />
                {i < 4 && <div className="mt-1 w-0.5 flex-1 bg-warm-200 dark:bg-dark-700" style={{ minHeight: '40px' }} />}
              </div>
              <div className="mb-6 flex-1 rounded-2xl bg-warm-200 p-4 dark:bg-dark-700">
                <div className="mb-2 h-4 w-16 rounded bg-warm-300 dark:bg-dark-600" />
                <div className="mb-1 h-5 w-48 rounded bg-warm-300 dark:bg-dark-600" />
                <div className="h-3 w-32 rounded bg-warm-300 dark:bg-dark-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
