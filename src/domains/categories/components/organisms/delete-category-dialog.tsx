'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CATEGORIES_MESSAGES } from '../../messages';

interface DeleteCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  categoryName: string;
  isLoading?: boolean;
}

/**
 * DeleteCategoryDialog - Organism component
 * Confirmation dialog for category deletion with warning
 */
export function DeleteCategoryDialog({
  open,
  onClose,
  onConfirm,
  categoryName,
  isLoading
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>{CATEGORIES_MESSAGES.DELETE_DIALOG.TITLE}</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription>
          {CATEGORIES_MESSAGES.DELETE_DIALOG.DESCRIPTION.replace(
            '{name}',
            categoryName
          )}
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {CATEGORIES_MESSAGES.DELETE_DIALOG.CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {CATEGORIES_MESSAGES.DELETE_DIALOG.CONFIRM}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
