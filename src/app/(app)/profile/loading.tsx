export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl animate-pulse px-4">
        {/* Profile header card */}
        <div className="mb-6 flex items-start gap-4 rounded-2xl bg-white p-5 dark:bg-dark-800">
          <div className="h-20 w-20 rounded-2xl bg-warm-200 dark:bg-dark-700" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-32 rounded-lg bg-warm-200 dark:bg-dark-700" />
            <div className="h-4 w-48 rounded-lg bg-warm-200 dark:bg-dark-700" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-20 rounded-lg bg-warm-200 dark:bg-dark-700" />
              ))}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mb-5 h-10 rounded-xl bg-warm-200 dark:bg-dark-700" />
        {/* Content area */}
        <div className="space-y-3">
          <div className="h-20 rounded-2xl bg-warm-200 dark:bg-dark-700" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-warm-200 dark:bg-dark-700" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
