/**
 * Profile Management Types
 * TypeScript interfaces for profile data, requests, and responses
 */

// Profile data from API response
export interface Profile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    profile_picture: string | null;
    country_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    country?: {
        id: number;
        code: string;
        name: {
            ar: string;
            en: string;
        };
        phone_code: string;
        created_at: string | null;
        updated_at: string | null;
    };
}

// Profile form data for submission
export interface ProfileFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    country_id?: number | null;
    profile_picture?: string;
    password?: string;
    password_confirmation?: string;
}

// Profile update request data (matches the existing ProfileData interface)
export interface ProfileUpdateRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string | null;
    country_id?: number | null;
    profile_picture?: string | null;
    password?: string | null;
    password_confirmation?: string | null;
}

// Profile response from API
export interface ProfileResponse {
    success: boolean;
    message: string;
    data: Profile;
}

// Password update specific request
export interface PasswordUpdateRequest {
    password: string;
    password_confirmation: string;
}