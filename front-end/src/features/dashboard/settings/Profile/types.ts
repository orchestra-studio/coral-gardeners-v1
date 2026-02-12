// Profile Form Data
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