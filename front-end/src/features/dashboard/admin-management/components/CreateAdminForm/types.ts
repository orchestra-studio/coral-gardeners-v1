import type { AdminUser } from "@/services/adminManagement";

export interface AdminFormData extends Record<string, unknown> {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    profile_picture: string | null;
    country_id: number | null;
}

export interface CreateAdminFormProps {
    open: boolean;
    onClose: () => void;
    admin?: AdminUser; // Optional admin for edit mode
}
