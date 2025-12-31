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
  const hiddenPaths = ['/movimientos/crear', '/movimientos/editar'];
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return (
    <Link href="/movimientos/crear" className="md:hidden">
      <Button
        size="lg"
        className="fixed right-6 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Crear nuevo movimiento"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
}
