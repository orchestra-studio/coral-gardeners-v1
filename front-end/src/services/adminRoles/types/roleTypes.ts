/**
 * Admin Roles Types
 */

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    // Optional fields for specific contexts
    permissions?: string[];
    users_count?: number;
    // API select endpoint returns different format
    value?: number;
    label?: string;
}

export interface Permission {
    id: number;
    name: string;
    display_name: {
        ar: string;
        en: string;
    };
    description?: {
        ar: string;
        en: string;
    };
    module: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PermissionGroup {
    module: string;
    permissions: {
        name: string;
        display_name: {
            ar: string;
            en: string;
        };
        description?: {
            ar: string;
            en: string;
        };
    }[];
}

export interface RoleFormData {
    name: string;
    permissions?: string[];
}

export interface RolesListResponse {
    data: Role[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface RolesListParams {
    page?: number;
    page_count?: number;
    name?: string;
    guard_name?: string;
    created_from?: string;
    created_to?: string;
}

export interface CreateRoleRequest {
    name: string;
}

export interface UpdateRoleRequest {
    name: string;
}

export interface UpdateRolePermissionsRequest {
    permissions: string[];
    id: string | number;
}