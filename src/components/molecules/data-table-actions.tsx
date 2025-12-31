import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Data Table Actions Molecule
 * Reusable component for table row actions (edit/delete)
 */
export function DataTableActions({ onEdit, onDelete }: DataTableActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
