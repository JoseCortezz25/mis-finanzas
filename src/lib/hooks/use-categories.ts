'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/lib/supabase/client';
import { CategoryRepository, type Category } from '@/lib/repositories';
import {
  createCategory,
  updateCategory,
  deleteCategory
} from '@/app/actions/category-actions';

/**
 * Query key factory for categories
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (userId: string) => [...categoryKeys.lists(), userId] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  default: () => [...categoryKeys.all, 'default'] as const,
  custom: (userId: string) => [...categoryKeys.all, 'custom', userId] as const,
  available: (userId: string) =>
    [...categoryKeys.all, 'available', userId] as const
};

/**
 * Hook to fetch all available categories (default + custom)
 */
export function useCategories() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      console.log('[CATEGORIES] useCategories - Obteniendo categorias');
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      const result = await repository.findAvailable(user.id);
      console.log(
        '[CATEGORIES] useCategories - Exito:',
        result.length,
        'categorias'
      );
      return result;
    }
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      console.log('[CATEGORIES] useCategory - Obteniendo categoria:', id);
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      const result = await repository.findById(id, user.id);
      console.log('[CATEGORIES] useCategory - Exito:', result);
      return result;
    },
    enabled: !!id
  });
}

/**
 * Hook to fetch default categories
 */
export function useDefaultCategories() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: categoryKeys.default(),
    queryFn: async () => {
      console.log(
        '[CATEGORIES] useDefaultCategories - Obteniendo categorias por defecto'
      );
      const repository = new CategoryRepository(supabase);
      const result = await repository.findDefault();
      console.log(
        '[CATEGORIES] useDefaultCategories - Exito:',
        result.length,
        'categorias'
      );
      return result;
    }
  });
}

/**
 * Hook to fetch custom categories
 */
export function useCustomCategories() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      console.log(
        '[CATEGORIES] useCustomCategories - Obteniendo categorias personalizadas'
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      const result = await repository.findCustom(user.id);
      console.log(
        '[CATEGORIES] useCustomCategories - Exito:',
        result.length,
        'categorias'
      );
      return result;
    }
  });
}

/**
 * Hook to fetch category statistics
 */
export function useCategoryStats() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: [...categoryKeys.all, 'stats'],
    queryFn: async () => {
      console.log('[CATEGORIES] useCategoryStats - Obteniendo estadisticas');
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      const result = await repository.getStats(user.id);
      console.log('[CATEGORIES] useCategoryStats - Exito:', result);
      return result;
    }
  });
}

/**
 * Hook to create a new custom category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      console.log(
        '[CATEGORIES] useCreateCategory - Categoria creada exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    }
  });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      console.log(
        '[CATEGORIES] useUpdateCategory - Categoria actualizada exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    }
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      console.log(
        '[CATEGORIES] useDeleteCategory - Categoria eliminada exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    }
  });
}
