import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { MiniPlayer } from '@/components/audio/MiniPlayer';
import { FullPlayerSheet } from '@/components/audio/FullPlayerSheet';

// All routes inside (app) require an authenticated session. getServerSession()
// reads cookies/headers, which is inherently dynamic — mark the layout
// force-dynamic so Next.js never tries to prerender it (same root cause as
// the dashboard BUG-001 regression).
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  return (
    <AppShell>
      {children}
      <MiniPlayer />
      <FullPlayerSheet />
    </AppShell>
  );
}
