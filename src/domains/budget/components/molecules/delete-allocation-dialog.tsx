'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteAllocation } from '@/lib/hooks/use-allocations';
import { toast } from 'sonner';
import { allocationTextMap } from '@/domains/budget/allocation.text-map';

interface DeleteAllocationDialogProps {
  allocationId: string;
  budgetId?: string;
}

/**
 * Confirmation dialog for deleting an allocation
 * Displays AlertDialog with confirmation message before deletion
 */
export function DeleteAllocationDialog({
  allocationId
}: DeleteAllocationDialogProps) {
  const deleteAllocation = useDeleteAllocation();

  const handleDelete = async () => {
    const result = await deleteAllocation.mutateAsync(allocationId);

    if (result.success) {
      toast.success(allocationTextMap.successDelete);
    } else {
      toast.error(result.error || allocationTextMap.errorDelete);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={allocationTextMap.deleteButton}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {allocationTextMap.deleteConfirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {allocationTextMap.deleteConfirmMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {allocationTextMap.deleteCancelButton}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteAllocation.isPending
              ? allocationTextMap.deleting
              : allocationTextMap.deleteConfirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
