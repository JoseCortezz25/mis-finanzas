'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  BarChart3,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/presupuesto', icon: Wallet, label: 'Presupuesto' },
  { href: '/movimientos', icon: Receipt, label: 'Movimientos' },
  { href: '/reportes', icon: BarChart3, label: 'Reportes' },
  { href: '/perfil', icon: User, label: 'Perfil' }
] as const;

/**
 * Mobile Bottom Navigation
 * Fixed bottom navigation bar for mobile devices
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/95 fixed right-0 bottom-0 left-0 z-50 h-16 border-t shadow-lg backdrop-blur-sm md:hidden">
      <div className="flex h-full items-center justify-around px-2">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-md px-3 py-2 transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-none font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
