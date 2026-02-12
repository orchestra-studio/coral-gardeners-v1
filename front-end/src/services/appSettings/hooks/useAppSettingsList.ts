/**
 * App Settings List Query Hook
 */

import { useQuery } from '@tanstack/react-query';
import { appSettingsApi } from '@/lib/api/appSettings';
import { appSettingsKeys } from '../keys/appSettingsKeys';
import type { GetAppSettingsParams } from '../types/appSettingsTypes';

export function useAppSettingsList(params?: GetAppSettingsParams) {
    return useQuery({
        queryKey: appSettingsKeys.list(params as Record<string, unknown>),
        queryFn: async () => {
            const response = await appSettingsApi.getAll(params);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch app settings');
            }
            return response.data;
        },
    });
}
