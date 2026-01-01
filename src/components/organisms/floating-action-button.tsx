'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Floating Action Button (FAB)
 * Mobile-only circular button to create new transaction
 * Fixed in bottom right corner, above mobile navigation
 * Hidden on create/edit pages
 */
export function FloatingActionButton() {
  const pathname = usePathname();

  // Hide FAB on create and edit pages
  const hiddenPaths = [
    '/movimientos/crear',
    '/movimientos/editar',
    '/presupuesto/crear',
    '/presupuesto/editar'
  ];
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path));

  if (shouldHide) {
    return null;
  }

  // Show in desktop only on dashboard
  const isOnDashboard = pathname === '/dashboard';
  const showInDesktop = isOnDashboard;

  // Determine which page to link to based on current route
  const isOnBudgetPage = pathname?.startsWith('/presupuesto');
  const createUrl = isOnBudgetPage
    ? '/presupuesto/crear'
    : '/movimientos/crear';
  const ariaLabel = isOnBudgetPage
    ? 'Crear nuevo presupuesto'
    : 'Crear nuevo movimiento';

  return (
    <Link href={createUrl} className={showInDesktop ? '' : 'md:hidden'}>
      <Button
        size="lg"
        className="fixed right-6 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
        aria-label={ariaLabel}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
}
