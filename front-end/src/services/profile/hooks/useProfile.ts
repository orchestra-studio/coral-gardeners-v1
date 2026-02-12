/**
 * Profile Query Hook
 */

import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { profileKeys } from '../keys/profileKeys';

/**
 * Hook to fetch current user profile
 */
export function useProfile() {
    return useQuery({
        queryKey: profileKeys.profile(),
        queryFn: async () => {
            const response = await profileApi.get();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch profile');
            }
            return response.data;
        },
    });
}
