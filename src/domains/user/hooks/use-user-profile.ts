'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../queries';

/**
 * Query keys for user profile
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const
};

/**
 * Hook to fetch current user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
}
