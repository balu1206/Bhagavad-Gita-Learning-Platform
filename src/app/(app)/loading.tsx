export default function AppLoading() {
  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-2xl animate-pulse px-4">
        {/* Header skeleton */}
        <div className="mb-6 h-8 w-48 rounded-xl bg-warm-200 dark:bg-dark-700" />
        {/* Card skeletons */}
        <div className="mb-4 h-32 rounded-2xl bg-warm-200 dark:bg-dark-700" />
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-warm-200 dark:bg-dark-700" />
          ))}
        </div>
        <div className="h-48 rounded-2xl bg-warm-200 dark:bg-dark-700" />
      </div>
    </div>
  );
}
