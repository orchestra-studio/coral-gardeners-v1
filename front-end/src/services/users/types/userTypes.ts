/**
 * User Types
 * Based on the API documentation for users endpoints
 */

// User base structure
export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    profile_picture?: string | null;
    country_id?: number | null;
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    // Additional fields that might be present
    full_name?: string; // Computed field
    country?: {
        id: number;
        code: string; // ISO country code (e.g., "AL", "US")
        name: Record<string, string>; // Multilingual: { "en": "Albania", "ar": "ألبانيا" }
        phone_code: string; // International dialing code (e.g., "355")
        created_at: string | null;
        updated_at: string | null;
        deleted_at: string | null;
    } | null;
}

// API Response types
export interface UsersListResponse {
    success: boolean;
    message: string;
    data: User[];
    // Pagination info based on API documentation
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: User;
}

// Create user payload
export interface CreateUserPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    country_id?: number;
    is_active?: boolean;
}

// Update user payload
export interface UpdateUserPayload {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone?: string;
    country_id?: number;
    is_active?: boolean;
}

// Form data structure for user forms
export interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    password?: string; // Optional for updates
    phone?: string;
    country_id?: number;
    is_active: boolean;
}

// Filters for user queries
export interface UsersFilters {
    search?: string;
    email?: string;
    from_date?: string;
    to_date?: string;
    phone?: string;
    country_id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    order?: 'asc' | 'desc';
    page?: number;
    page_count?: number;
}

// User selection option for dropdowns
export interface UserSelectOption {
    id: number;
    label: string; // Full name
    email: string;
    is_active: boolean;
}