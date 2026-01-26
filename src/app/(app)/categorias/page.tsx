'use client';

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
import { PageLayout } from '@/components/templates/page-layout';
import { EmptyState } from '@/components/molecules/empty-state';
import { CategoryList } from '@/domains/categories/components/organisms/category-list';
import { CATEGORIES_MESSAGES } from '@/domains/categories/messages';
import { deleteCategory } from '@/app/actions/category-actions';
import { toast } from 'sonner';
import type { Category } from '@/lib/repositories/category-repository';

/**
 * Categorias Page
 * CRUD interface for managing custom categories
 */
export default function CategoriasPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  const customCategories = categories?.filter(c => c.is_custom) || [];

  const handleCreate = () => {
    router.push('/categorias/create');
  };

  const handleEdit = (category: Category) => {
    router.push(`/categorias/${category.id}/edit`);
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
    </PageLayout>
  );
}
