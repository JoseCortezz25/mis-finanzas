import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DASHBOARD_MESSAGES } from '../messages';

interface ErrorBudgetsStateProps {
  onRetry: () => void;
}

/**
 * Error state when budget data fails to load
 * Provides retry functionality for user recovery
 */
export function ErrorBudgetsState({ onRetry }: ErrorBudgetsStateProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex min-h-[300px] flex-col items-center justify-center space-y-6 rounded-lg border-2 p-8 text-center">
      {/* Icon */}
      <div className="bg-destructive/10 rounded-full p-4">
        <AlertCircle
          className="text-destructive h-12 w-12"
          aria-hidden="true"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h3 className="text-destructive text-xl font-semibold">
          {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.ERROR.TITLE}
        </h3>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.ERROR.DESCRIPTION}
        </p>
      </div>

      {/* Retry Button */}
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.ERROR.CTA}
      </Button>
    </div>
  );
}
