/**
 * App Settings Types
 */

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
    key: string;
    value: string;
}

export interface AppSettingsListResponse {
    data: AppSetting[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface GroupedSettings {
    [category: string]: AppSetting[];
}

export interface GetAppSettingsParams {
    page?: number;
    page_count?: number;
    search?: string;
    category?: string;
}