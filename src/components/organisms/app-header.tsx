'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wallet,
  LogOut,
  LayoutDashboard,
  Receipt,
  BarChart3,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  userEmail?: string;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/presupuesto', icon: Wallet, label: 'Presupuesto' },
  { href: '/movimientos', icon: Receipt, label: 'Movimientos' },
  { href: '/reportes', icon: BarChart3, label: 'Reportes' }
] as const;

/**
 * App Header
 * Responsive header that adapts to mobile and desktop
 */
export function AppHeader({ userEmail, onSignOut }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 mx-auto w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-bold md:text-xl">Mis Finanzas</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {userEmail && (
            <span className="text-muted-foreground hidden text-sm lg:inline">
              {userEmail}
            </span>
          )}
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
