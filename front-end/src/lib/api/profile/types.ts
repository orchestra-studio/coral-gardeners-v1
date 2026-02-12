/**
 * Profile API Types
 */

export interface ProfileData {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    profile_picture?: string | null;
    password?: string | null;
    password_confirmation?: string | null;
}

export interface ProfileApiResponse {
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
    country: {
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
    };
}

export interface PasswordChangeRequest {
    current_password: string;
    password: string;
    password_confirmation: string;
}
