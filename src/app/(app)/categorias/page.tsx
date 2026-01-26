'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/lib/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { PageLayout } from '@/components/templates/page-layout';
import { EmptyState } from '@/components/molecules/empty-state';
import { CategoryList } from '@/domains/categories/components/organisms/category-list';
import { CategoryForm } from '@/domains/categories/components/organisms/category-form';
import { CATEGORIES_MESSAGES } from '@/domains/categories/messages';
import {
  createCategory,
  updateCategory,
  deleteCategory
} from '@/app/actions/category-actions';
import { toast } from 'sonner';
import type { Category } from '@/lib/repositories/category-repository';
import type { CategoryFormValues } from '@/lib/validations/category-schema';

/**
 * Categorias Page
 * CRUD interface for managing custom categories
 */
export default function CategoriasPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customCategories = categories?.filter(c => c.is_custom) || [];

  const handleCreate = () => {
    router.push('/categorias/create');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormDialogOpen(true);
  };

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, data);
        if (result.success) {
          toast.success(CATEGORIES_MESSAGES.SUCCESS.UPDATED);
          setFormDialogOpen(false);
          setEditingCategory(null);
        } else {
          toast.error(result.error);
        }
      } else {
        // Add default type for backward compatibility
        const result = await createCategory({
          ...data,
          type: 'expense'
        });
        if (result.success) {
          toast.success(CATEGORIES_MESSAGES.SUCCESS.CREATED);
          setFormDialogOpen(false);
        } else {
          toast.error(result.error);
        }
      }
    } catch {
      toast.error(CATEGORIES_MESSAGES.ERROR.GENERIC);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if (result.success) {
      toast.success(CATEGORIES_MESSAGES.SUCCESS.DELETED);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <PageLayout
      title={CATEGORIES_MESSAGES.PAGE.TITLE}
      description={CATEGORIES_MESSAGES.PAGE.SUBTITLE}
      actions={
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {CATEGORIES_MESSAGES.ACTIONS.CREATE}
        </Button>
      }
      isLoading={isLoading}
      loadingMessage={CATEGORIES_MESSAGES.LOADING.LIST}
    >
      {customCategories.length === 0 ? (
        <EmptyState
          icon={Plus}
          title={CATEGORIES_MESSAGES.EMPTY.TITLE}
          description={CATEGORIES_MESSAGES.EMPTY.DESCRIPTION}
          actionLabel={CATEGORIES_MESSAGES.EMPTY.ACTION}
          onAction={handleCreate}
        />
      ) : (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{CATEGORIES_MESSAGES.PAGE.LIST_TITLE}</CardTitle>
              <CardDescription>
                {CATEGORIES_MESSAGES.PAGE.LIST_DESCRIPTION}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryList
              categories={customCategories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-[95%] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{CATEGORIES_MESSAGES.FORM.TITLE_EDIT}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleSubmit}
            defaultValues={
              editingCategory
                ? {
                    name: editingCategory.name,
                    description: editingCategory.description || '',
                    color: editingCategory.color || '#A5B4FC',
                    icon: editingCategory.icon || 'more-horizontal'
                  }
                : undefined
            }
            isLoading={isSubmitting}
            submitLabel={CATEGORIES_MESSAGES.FORM.SUBMIT_UPDATE}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
