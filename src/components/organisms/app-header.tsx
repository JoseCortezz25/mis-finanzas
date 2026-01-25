'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onSignOut: () => void;
}

/**
 * App Header
 * Responsive header that adapts to mobile and desktop
 */
export function AppHeader({ onSignOut }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 mx-auto w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-bold md:text-xl">Mis Finanzas</span>
        </Link>

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              'h-9 gap-2 md:h-10',
              pathname === '/perfil' && 'bg-primary/10 text-primary'
            )}
          >
            <Link href="/perfil">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Perfil</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="h-9 gap-2 md:h-10"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
