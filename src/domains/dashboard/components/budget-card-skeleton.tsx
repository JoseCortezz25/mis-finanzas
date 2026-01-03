import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for budget card
 * Matches the structure of BudgetCard for consistent perceived performance
 */
export function BudgetCardSkeleton() {
  return (
    <Card className="border-2">
      <CardContent className="space-y-4 p-4 sm:p-5 lg:p-6">
        {/* Badge skeleton */}
        <Skeleton className="h-6 w-24 rounded-full" />

        {/* Progress bar skeleton */}
        <Skeleton className="h-3 w-full rounded-full" />

        {/* Budget name skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Amount details skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Period skeleton */}
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}
