'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';

export default function BudgetDetailError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Budget detail error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-6">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>{BUDGET_DETAIL_MESSAGES.ERROR.LOAD_FAILED}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {BUDGET_DETAIL_MESSAGES.ERROR.NETWORK_ERROR}
          </p>
          <div className="flex gap-2">
            <Button onClick={reset} variant="default">
              {BUDGET_DETAIL_MESSAGES.ACTIONS.REFRESH}
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              {BUDGET_DETAIL_MESSAGES.PAGE.BACK}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
