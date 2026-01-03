import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DASHBOARD_MESSAGES } from '../messages';

/**
 * Empty state when user has no active budgets
 * Shows clear call-to-action to create first budget
 */
export function EmptyBudgetsState() {
  const router = useRouter();

  return (
    <div className="border-border flex min-h-[300px] flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed p-8 text-center">
      {/* Icon */}
      <div className="bg-muted rounded-full p-4">
        <Wallet
          className="text-muted-foreground h-12 w-12"
          aria-hidden="true"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h3 className="text-foreground text-xl font-semibold">
          {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.EMPTY.TITLE}
        </h3>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.EMPTY.DESCRIPTION}
        </p>
      </div>

      {/* CTA Button */}
      <Button
        onClick={() => router.push('/presupuesto/crear')}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" aria-hidden="true" />
        {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.EMPTY.CTA}
      </Button>
    </div>
  );
}
