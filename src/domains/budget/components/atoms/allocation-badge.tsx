import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { allocationTextMap } from '@/domains/budget/allocation.text-map';

/**
 * Badge component for allocation type indicator
 * Used in transaction lists to visually distinguish allocations
 */
export function AllocationBadge() {
  return (
    <Badge
      variant="outline"
      className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-400"
    >
      <Tag className="mr-1 h-3 w-3" />
      {allocationTextMap.allocationLabel}
    </Badge>
  );
}
