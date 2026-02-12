/**
 * App Setting Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { appSettingsApi } from '@/lib/api/appSettings';
import { appSettingsKeys } from '../../keys/appSettingsKeys';

export function useUpdateAppSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            const response = await appSettingsApi.update(key, { value });
            if (!response.success) {
                throw new Error(response.message || 'Failed to update setting');
            }
            return response;
        },
        onSuccess: (response) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate app settings queries to refetch the data
            queryClient.invalidateQueries({ queryKey: appSettingsKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update app setting';
            toast.error(errorMessage);
        },
    });
}
