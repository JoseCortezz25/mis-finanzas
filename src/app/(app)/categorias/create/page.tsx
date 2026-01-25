'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createCategory } from '@/app/actions/category-actions';
import type { CategoryFormValues } from '@/lib/validations/category-schema';

/**
 * Categorias Create Page
 * Page for creating a new custom category
 */
export default function CategoriasCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.push('/categorias');
  };

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await createCategory({
        ...data,
        type: 'expense'
      });

      if (result.success) {
        toast.success(CATEGORIES_MESSAGES.SUCCESS.CREATED);
        router.push('/categorias');
      } else {
        toast.error(CATEGORIES_MESSAGES.ERROR.GENERIC);
      }
    } catch {
      toast.error(CATEGORIES_MESSAGES.ERROR.GENERIC);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title={CATEGORIES_MESSAGES.CREATE_PAGE.TITLE}
      description={CATEGORIES_MESSAGES.CREATE_PAGE.SUBTITLE}
      actions={
        <Button variant="outline" onClick={handleCancel}>
          {CATEGORIES_MESSAGES.CREATE_PAGE.BACK}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>{CATEGORIES_MESSAGES.CREATE_PAGE.FORM_TITLE}</CardTitle>
            <CardDescription>
              {CATEGORIES_MESSAGES.CREATE_PAGE.FORM_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              submitLabel={CATEGORIES_MESSAGES.FORM.SUBMIT_CREATE}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {CATEGORIES_MESSAGES.CREATE_PAGE.GUIDE_TITLE}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-4 text-sm">
                {CATEGORIES_MESSAGES.CREATE_PAGE.GUIDE_ITEMS.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {CATEGORIES_MESSAGES.CREATE_PAGE.NOTE_TITLE}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {CATEGORIES_MESSAGES.CREATE_PAGE.NOTE_DESCRIPTION}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
