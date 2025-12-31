'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  href: string;
  label?: string;
  className?: string;
}

/**
 * Floating Action Button (FAB)
 * Fixed button in bottom right corner for primary actions
 */
export function FloatingActionButton({
  href,
  label = 'Nuevo',
  className
}: FloatingActionButtonProps) {
  return (
    <Link href={href}>
      <Button
        size="lg"
        className={cn(
          'fixed right-6 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl md:bottom-6',
          'md:h-auto md:w-auto md:rounded-md md:px-6',
          className
        )}
      >
        <Plus className="h-6 w-6 md:mr-2" />
        <span className="hidden md:inline">{label}</span>
      </Button>
    </Link>
  );
}
