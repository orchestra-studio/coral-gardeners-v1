/**
 * Permission Management API
 * Operations for managing role permissions
 */

import { api, ApiResponse } from "../client";
import { Role } from "../types";

export const permissionManagementApi = {
    // Get all available permissions in the system grouped by module
    getAll: (): Promise<ApiResponse<Record<string, {
        name: string;
        display_name: { ar: string; en: string };
        description?: { ar: string; en: string }
    }[]>>> => {
        return api.get("/roles/permissions", { showLoading: false });
    },

    // Get permissions for a specific role
    getForRole: (roleId: string | number): Promise<ApiResponse<Role>> => {
        return api.get<Role>(`/roles/${roleId}`, { showLoading: false });
    },

    // Update permissions for a role
    updateForRole: (roleId: string | number, data: { permissions: string[] }): Promise<ApiResponse<Role>> => {
        return api.post<Role>(`/roles/${roleId}/permissions`, {
            permissions: data.permissions
        });
    },
};
