import { PieChart } from 'lucide-react';
import { allocationTextMap } from '@/domains/budget/allocation.text-map';

/**
 * Empty state component when no allocations exist
 * Displayed in chart when there are no allocations to show
 */
export function EmptyAllocationsState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-muted mb-4 rounded-full p-4">
        <PieChart className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">
        {allocationTextMap.noAllocationsYet}
      </h3>
      <p className="text-muted-foreground max-w-sm text-center text-sm">
        {allocationTextMap.noAllocationsDescription}
      </p>
    </div>
  );
}
