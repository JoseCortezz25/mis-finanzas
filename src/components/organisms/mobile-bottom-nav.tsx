'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  BarChart3,
  User,
  Tags
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/presupuesto', icon: Wallet, label: 'Presupuesto' },
  { href: '/movimientos', icon: Receipt, label: 'Movimientos' },
  { href: '/categorias', icon: Tags, label: 'Categorías' },
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
    <nav className="bg-background/95 md:border-border fixed right-0 bottom-0 left-0 z-50 h-16 border-t shadow-lg backdrop-blur-sm md:right-auto md:bottom-6 md:left-1/2 md:h-14 md:w-[min(720px,calc(100%-3rem))] md:-translate-x-1/2 md:rounded-full md:border md:px-2 md:shadow-xl">
      <div className="flex h-full items-center justify-around px-2 sm:px-1 md:justify-between">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-[34px] flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors sm:min-w-[64px] md:min-w-0 md:flex-row md:gap-2 md:rounded-full md:px-2 md:py-2',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="size-5 sm:size-4" />
              <span className="hidden text-[10px] leading-none font-medium sm:block md:text-[14px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
