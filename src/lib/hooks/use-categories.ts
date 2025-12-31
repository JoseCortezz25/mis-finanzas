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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      return repository.findAvailable(user.id);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      return repository.findById(id, user.id);
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
      const repository = new CategoryRepository(supabase);
      return repository.findDefault();
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      return repository.findCustom(user.id);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new CategoryRepository(supabase);
      return repository.getStats(user.id);
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    }
  });
}
