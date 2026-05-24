import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { ContinueCard } from '@/components/dashboard/ContinueCard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { RecentBookmarks } from '@/components/dashboard/RecentBookmarks';
import { RecommendedScroller } from '@/components/dashboard/RecommendedScroller';

export const metadata: Metadata = { title: 'Dashboard' };

// BUG-001 (fix #2): Auth pages MUST be dynamic. The earlier try/catch was
// catching Next.js's internal "Dynamic server usage" signal (a special throw
// that propagates up to mark the page as dynamic) and treating it as a real
// error — which caused every dashboard visit to redirect to /login.
//
// Correct pattern: let getServerSession() throw freely, and mark the route
// explicitly dynamic so the framework doesn't try to prerender it at build time.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  // Safe defaults for new users with no profile data
  const user = (session.user ?? {}) as {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeBanner name={user.name ?? null} image={user.image ?? null} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContinueCard />
        </div>
        <div>
          <StatsGrid />
        </div>
      </div>

      <ProgressSection />
      <RecentBookmarks />
      <RecommendedScroller />
    </div>
  );
}
