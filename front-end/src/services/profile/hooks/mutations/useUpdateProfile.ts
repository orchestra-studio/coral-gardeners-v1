/**
 * Profile Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { profileApi } from '@/lib/api/profile';
import type { ProfileData } from '@/lib/api/profile/types';
import { profileKeys } from '../../keys/profileKeys';

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<ProfileData>) => {
            const response = await profileApi.update(data as ProfileData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update profile');
            }
            return response;
        },
        onSuccess: (response) => {
            // Invalidate profile queries to refresh data
            queryClient.invalidateQueries({ queryKey: profileKeys.all });

            toast.success(response.message || 'Profile updated successfully');
        },
        onError: (error) => {
            console.error('Update profile error:', error);
            toast.error(error.message || 'Failed to update profile');
        },
    });
}
