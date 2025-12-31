'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg">Cargando...</div>
    </div>
  );
}
