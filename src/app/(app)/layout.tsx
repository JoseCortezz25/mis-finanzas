'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { AppHeader } from '@/components/organisms/app-header';
import { MobileBottomNav } from '@/components/organisms/mobile-bottom-nav';
import { FloatingActionButton } from '@/components/organisms/floating-action-button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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
    <div className="bg-background min-h-screen pb-16 md:pb-0">
      <AppHeader userEmail={user?.email} onSignOut={handleSignOut} />

      <main className="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      <MobileBottomNav />
      <FloatingActionButton />
    </div>
  );
}
