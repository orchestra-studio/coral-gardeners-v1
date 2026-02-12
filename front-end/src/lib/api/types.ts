// API Types for the admin management system

// Standard NestJS pagination response
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    // Optional fields for different contexts
    description?: string;
    permissions?: string[];
    users_count?: number;
    // API select endpoint returns different format
    value?: number;
    label?: string;
}

export interface Permission {
    id: number;
    name: string;
    display_name?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Country {
    id: number;
    code: string;
    name: {
        ar: string;
        en: string;
    };
    phone_code: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface AdminUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
    profile_picture: string | null;
    country_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    country: Country | null;
    roles: Role[];
    // Computed properties for compatibility
    phone_number?: string;
    profile_image?: string;
    isTrusted?: boolean;
}

// Use standard pagination response for admins
export type AdminsListResponse = PaginatedResponse<AdminUser>;

export interface CreateAdminRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string | null;
    profile_picture?: string | null;
    phone_code?: string | null;
}

export interface UpdateAdminRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string | null;
    phone?: string | null;
    profile_picture?: string | null;
    password_confirmation?: string | null;
}

export interface UpdateAdminRolesRequest {
    role_ids: number[];
}

// Query parameters for listing admins
export interface AdminsListParams {
    page?: number;
    page_count?: number;
    email?: string;
    name?: string;
    phone?: string;
}