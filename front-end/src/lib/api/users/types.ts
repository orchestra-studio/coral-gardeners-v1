/**
 * Users API Types
 * API-specific types for user operations
 */

// Basic User interface for API operations
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

// API-specific request parameters based on the API documentation
export interface UsersListParams {
    page?: number;           // The page number to retrieve. Default: 1
    page_count?: number;     // The number of users to display per page. Default: 15
    order?: 'asc' | 'desc';  // The sorting order. Default: desc
    search?: string;         // A keyword or phrase to search for users (e.g., by name or email)
    email?: string;          // Filter users whose email contains the given value
    from_date?: string;      // Filter users created on or after this date. Example: 2023-01-01
    to_date?: string;        // Filter users created on or before this date. Example: 2023-12-31
    phone?: string;          // Filter users by phone number. Example: 123456789
    country_id?: number;     // Filter users by their associated country ID. Example: 5
    username?: string;       // Filter users by username
    first_name?: string;     // Filter users by first name
    last_name?: string;      // Filter users by last name
}

// Delete user request parameters
export interface DeleteUserParams {
    username: string;
}

// Change password payload
export interface ChangePasswordPayload {
    new_password: string;
}

// Create user payload
export interface CreateUserPayload {
    username?: string; // Optional - will be auto-generated if not provided
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    profile_picture?: string;
    country_id?: number;
}

// Paginated API response for users list
export interface UsersPaginatedResponse {
    success: boolean;
    message: string;
    data: {
        data: User[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// API response for delete operation
export interface DeleteUserResponse {
    success: boolean;
    message: string;
    data?: null;
}

// API response for statistics
export interface UsersStatisticsResponse {
    success: boolean;
    message: string;
    data: {
        total: number;
        deleted: number;
        verified: number;
        unverified: number;
    };
}