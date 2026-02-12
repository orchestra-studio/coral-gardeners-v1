import type { User } from "@/services/users";

export interface UserFormData extends Record<string, unknown> {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    country_id: number | null;
    profile_picture: string | null;
}

export interface CreateUserFormProps {
    open: boolean;
    onClose: () => void;
    user?: User; // Optional user for edit mode (if needed in future)
}
