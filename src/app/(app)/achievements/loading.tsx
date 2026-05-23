// ISSUE-016: Skeleton for achievements page
export default function AchievementsLoading() {
  return (
    <div className="min-h-screen bg-warm-50 pb-24 pt-6 dark:bg-dark-950">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 h-8 w-48 rounded-md bg-warm-100 dark:bg-dark-800 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-warm-100 dark:bg-dark-800 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
