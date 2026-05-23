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

// BUG-001: Dashboard server component error fix
// Added null-safety, error logging, and safe defaults for user data
export default async function DashboardPage() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('[Dashboard] Failed to fetch session:', error);
    redirect('/login');
  }

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
