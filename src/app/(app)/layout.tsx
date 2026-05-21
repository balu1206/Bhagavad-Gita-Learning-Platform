import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { MiniPlayer } from '@/components/audio/MiniPlayer';
import { FullPlayerSheet } from '@/components/audio/FullPlayerSheet';

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
