import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for AllocationDistributionChart
 * Displayed while chart data is being fetched
 */
export function AllocationDistributionChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[250px]" /> {/* Title */}
        <Skeleton className="mt-2 h-4 w-[350px]" /> {/* Subtitle */}
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Skeleton className="h-[300px] w-[300px] rounded-full" />{' '}
        {/* Chart circle */}
      </CardContent>
    </Card>
  );
}
