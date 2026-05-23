// BUG-001 / ISSUE-016: Skeleton loading state for dashboard
export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome banner skeleton */}
      <div className="h-40 rounded-2xl bg-gradient-to-br from-saffron-200 to-gold-200 dark:from-dark-800 dark:to-dark-700 animate-pulse" />

      {/* Continue + Stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-48 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
        <div className="h-48 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
      </div>

      {/* Progress section */}
      <div className="h-32 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />

      {/* Bookmarks */}
      <div className="h-40 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />

      {/* Recommended */}
      <div className="h-56 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
    </div>
  );
}
