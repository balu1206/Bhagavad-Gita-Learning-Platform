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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = session.user as { name?: string | null; email?: string | null; image?: string | null };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeBanner name={user.name} image={user.image} />

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
