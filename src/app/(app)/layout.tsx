import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { MiniPlayer } from '@/components/audio/MiniPlayer';
import { FullPlayerSheet } from '@/components/audio/FullPlayerSheet';

// Routes inside (app) that are publicly browsable without a session
const PUBLIC_PREFIXES = ['/chapters'];

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: ReactNode }) {
  // Middleware injects x-pathname so we can distinguish public vs. protected routes
  const headersList = headers();
  const pathname = headersList.get('x-pathname') ?? '';

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  const session = await getServerSession(authOptions);
  if (!session && !isPublic) redirect('/login');

  return (
    <AppShell>
      {children}
      {/* Audio player only shown to authenticated users */}
      {session && <MiniPlayer />}
      {session && <FullPlayerSheet />}
    </AppShell>
  );
}
