'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { CategoryBadge } from '../molecules/category-badge';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { CATEGORIES_MESSAGES } from '../../messages';
import type { Category } from '@/lib/repositories/category-repository';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

/**
 * CategoryList - Organism component
 * Table displaying categories with edit/delete actions
 */
export function CategoryList({
  categories,
  onEdit,
  onDelete,
  isDeleting
}: CategoryListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await onDelete(categoryToDelete.id);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{CATEGORIES_MESSAGES.TABLE.NAME}</TableHead>
            <TableHead>{CATEGORIES_MESSAGES.TABLE.DESCRIPTION}</TableHead>
            <TableHead>{CATEGORIES_MESSAGES.TABLE.PREVIEW}</TableHead>
            <TableHead className="text-right">
              {CATEGORIES_MESSAGES.TABLE.ACTIONS}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-sm text-gray-600">
                {category.description || '-'}
              </TableCell>
              <TableCell>
                <CategoryBadge category={category} size="sm" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        categoryName={categoryToDelete?.name || ''}
        isLoading={isDeleting}
      />
    </>
  );
}
