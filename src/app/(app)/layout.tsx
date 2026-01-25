'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { AppHeader } from '@/components/organisms/app-header';
import { MobileBottomNav } from '@/components/organisms/mobile-bottom-nav';
import { FloatingActionButton } from '@/components/organisms/floating-action-button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase.auth.getUser().then(() => {
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => undefined);

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-16 md:pb-28">
      <AppHeader onSignOut={handleSignOut} />

      <main className="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      <MobileBottomNav />
      <FloatingActionButton />
    </div>
  );
}
