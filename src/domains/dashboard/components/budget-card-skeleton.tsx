import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for budget card
 * Matches the structure of BudgetStatusCard for consistent perceived performance
 */
export function BudgetCardSkeleton() {
  return (
    <Card className="border-2">
      <CardContent className="space-y-4 p-6">
        {/* Header section: Title + Subtitle + Badge */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              {/* Title skeleton */}
              <Skeleton className="h-6 w-3/4" />
              {/* Subtitle skeleton */}
              <Skeleton className="h-3 w-2/3" />
            </div>
            {/* Badge skeleton */}
            <Skeleton className="h-7 w-16 rounded-xl" />
          </div>
        </div>

        {/* Amounts section: Current/Total + Available */}
        <div className="space-y-2">
          {/* Large amount skeleton */}
          <Skeleton className="h-9 w-full" />
          {/* Available amount skeleton */}
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Progress bar skeleton */}
        <Skeleton className="h-2 w-full rounded-full" />

        {/* Optional help text skeleton (not always visible) */}
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
