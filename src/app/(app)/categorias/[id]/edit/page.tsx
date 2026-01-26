'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/domains/categories/components/organisms/category-form';
import { CATEGORIES_MESSAGES } from '@/domains/categories/messages';
import { updateCategory } from '@/app/actions/category-actions';
import { useCategories } from '@/lib/hooks';
import type { CategoryFormValues } from '@/lib/validations/category-schema';

/**
 * Categorias Edit Page
 * Page for editing a custom category
 */
export default function CategoriasEditPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = useMemo(() => {
    const value = params?.id;
    return Array.isArray(value) ? value[0] : value;
  }, [params]);
  const { data: categories, isLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = useMemo(() => {
    if (!categoryId) return undefined;
    return categories?.find(item => item.id === categoryId);
  }, [categories, categoryId]);

  const handleCancel = () => {
    router.push('/categorias');
  };

  const handleSubmit = async (data: CategoryFormValues) => {
    if (!categoryId) return;
    setIsSubmitting(true);

    try {
      const result = await updateCategory(categoryId, data);

      if (result.success) {
        toast.success(CATEGORIES_MESSAGES.SUCCESS.UPDATED);
        router.push('/categorias');
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error(CATEGORIES_MESSAGES.ERROR.GENERIC);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title={CATEGORIES_MESSAGES.EDIT_PAGE.TITLE}
      description={CATEGORIES_MESSAGES.EDIT_PAGE.SUBTITLE}
      actions={
        <Button variant="outline" onClick={handleCancel}>
          {CATEGORIES_MESSAGES.EDIT_PAGE.BACK}
        </Button>
      }
      isLoading={isLoading}
      loadingMessage={CATEGORIES_MESSAGES.LOADING.LIST}
    >
      {!isLoading && !category ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {CATEGORIES_MESSAGES.EDIT_PAGE.NOT_FOUND_TITLE}
            </CardTitle>
            <CardDescription>
              {CATEGORIES_MESSAGES.EDIT_PAGE.NOT_FOUND_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCancel}>
              {CATEGORIES_MESSAGES.EDIT_PAGE.BACK}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader>
              <CardTitle>{CATEGORIES_MESSAGES.EDIT_PAGE.FORM_TITLE}</CardTitle>
              <CardDescription>
                {CATEGORIES_MESSAGES.EDIT_PAGE.FORM_DESCRIPTION}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                defaultValues={
                  category
                    ? {
                        name: category.name,
                        description: category.description || '',
                        color: category.color || '#A5B4FC',
                        icon: category.icon || 'more-horizontal'
                      }
                    : undefined
                }
                isLoading={isSubmitting}
                submitLabel={CATEGORIES_MESSAGES.FORM.SUBMIT_UPDATE}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{CATEGORIES_MESSAGES.EDIT_PAGE.NOTE_TITLE}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {CATEGORIES_MESSAGES.EDIT_PAGE.NOTE_DESCRIPTION}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
