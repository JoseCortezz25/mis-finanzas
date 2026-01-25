'use client';

import { cn } from '@/lib/utils';

interface BudgetHelpTextProps {
  text: string;
  className?: string;
}

/**
 * BudgetHelpText - Molecule component
 * Displays help text or suggestions for budget management
 * Typically shown only for exceeded budgets
 */
export function BudgetHelpText({ text, className }: BudgetHelpTextProps) {
  return (
    <p
      className={cn(
        'text-sm leading-relaxed font-normal text-gray-600',
        className
      )}
    >
      {text}
    </p>
  );
}
