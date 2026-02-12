import { AdminUser } from "@/lib/api";

// Simple role dropdown item from API
export interface RoleDropdownItem {
    value: number;
    label: string;
}

// Transformed role for internal use
export interface RoleItem {
    id: number;
    name: string;
}

// Component props
export interface AdminRolesFormProps {
    adminRolesForm: {
        open: boolean;
        admin: AdminUser | null;
    };
    setAdminRolesForm: React.Dispatch<
        React.SetStateAction<{ open: boolean; admin: AdminUser | null }>
    >;
    getData: () => void;
}