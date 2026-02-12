import { Role } from "@/lib/api";
import { UseFormHandleSubmit, UseFormSetValue, UseFormWatch, UseFormReset } from "react-hook-form";

export interface PermissionObject {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        role_id: number;
        permission_id: number;
    };
}

export interface PermissionDetail {
    name: string;
    display_name: {
        ar: string;
        en: string;
    };
    description?: {
        ar: string;
        en: string;
    };
}

export interface PermissionGroup {
    [key: string]: PermissionDetail[];
}

export interface FormValues {
    permissions: { [key: string]: boolean };
}

export interface RolePermissionsProps {
    permissionsView: {
        open: boolean;
        role: Role | null;
    };
    setPermissionsView: React.Dispatch<
        React.SetStateAction<{ open: boolean; role: Role | null }>
    >;
}

export interface GroupState {
    checked: boolean;
    indeterminate: boolean;
}

export interface UsePermissionsReturn {
    loading: boolean;
    permissionGroups: PermissionGroup;
    rolePermissions: string[];
    expandedGroups: { [key: string]: boolean };
    toggleGroupExpansion: (groupName: string) => void;
}

export interface UseRolePermissionsReturn {
    handleSubmit: UseFormHandleSubmit<FormValues>;
    setValue: UseFormSetValue<FormValues>;
    watch: UseFormWatch<FormValues>;
    reset: UseFormReset<FormValues>;
    handlePermissionToggle: (permissionName: string) => void;
    handleGroupToggle: (groupName: string) => void;
    handleSelectAll: () => void;
    areAllPermissionsSelected: () => boolean;
    areSomePermissionsSelected: () => boolean;
    getGroupState: (groupName: string) => GroupState;
    onSubmit: (values: FormValues) => Promise<void>;
    isLoading: boolean;
}