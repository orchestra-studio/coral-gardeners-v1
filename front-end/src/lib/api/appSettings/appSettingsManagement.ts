/**
 * App Settings Management API
 * Operations for managing application settings
 */

import { api, ApiResponse } from "../client";

export interface AppSetting {
    id: number;
    key: string;
    value: string;
    display_name?: {
        ar: string;
        en: string;
    };
    description?: {
        ar: string;
        en: string;
    };
    type: string;
    category: string;
    created_at?: string;
    updated_at?: string;
}

export interface UpdateAppSettingRequest {
    value: string;
}

export interface AppSettingsListResponse {
    data: AppSetting[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetAppSettingsParams {
    page?: number;
    page_count?: number;
    search?: string;
    category?: string;
}

export const appSettingsManagementApi = {
    // Get all application settings with pagination
    getAll: (params?: GetAppSettingsParams): Promise<ApiResponse<AppSettingsListResponse>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_count) queryParams.append('page_count', params.page_count.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);

        const queryString = queryParams.toString();
        const url = queryString ? `/settings?${queryString}` : '/settings';

        return api.get<AppSettingsListResponse>(url, { showLoading: false });
    },

    // Update a specific application setting
    update: (key: string, data: UpdateAppSettingRequest): Promise<ApiResponse<AppSetting>> => {
        return api.patch<AppSetting>(`/settings/${key}`, data);
    },

    // Delete a specific application setting
    delete: (key: string): Promise<ApiResponse<void>> => {
        return api.delete<void>(`/settings/${key}`);
    },
};
