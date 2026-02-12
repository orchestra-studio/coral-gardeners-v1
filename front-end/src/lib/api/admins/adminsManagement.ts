/**
 * Admins Management API
 * CRUD operations for admin users
 */

import { api, ApiResponse } from "../client";
import {
    AdminsListResponse,
    AdminUser,
    CreateAdminRequest,
    UpdateAdminRequest,
    UpdateAdminRolesRequest,
    AdminsListParams,
    Role,
} from "../types";

// Helper function to convert role IDs to role names
export const getRoleNamesFromIds = async (roleIds: number[]): Promise<string[]> => {
    const rolesResponse = await api.get<Role[]>("/admins/management/roles/select", { showLoading: false });
    if (!rolesResponse.success || !Array.isArray(rolesResponse.data)) {
        throw new Error("Failed to fetch available roles");
    }

    const availableRoles = rolesResponse.data as unknown as Array<{ value: number, label: string }>;
    const roleNames: string[] = [];

    for (const roleId of roleIds) {
        const role = availableRoles.find(r => r.value === roleId);
        if (role) {
            roleNames.push(role.label);
        }
    }

    return roleNames;
};

export const adminsManagementApi = {
    // List all admins with optional filters
    list: (params?: AdminsListParams): Promise<ApiResponse<AdminsListResponse>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.page_count) queryParams.append("page_count", params.page_count.toString());
        if (params?.email) queryParams.append("email", params.email);
        if (params?.name) queryParams.append("name", params.name);
        if (params?.phone) queryParams.append("phone", params.phone);

        const url = `/admins${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        return api.get<AdminsListResponse>(url, { showLoading: false });
    },

    // Get a specific admin by ID
    get: (id: string | number): Promise<ApiResponse<AdminUser>> => {
        return api.get<AdminUser>(`/admins/${id}`, { showLoading: false });
    },

    // Create a new admin
    create: (data: CreateAdminRequest): Promise<ApiResponse<AdminUser>> => {
        return api.post<AdminUser>("/admins", data);
    },

    // Update admin details
    update: (id: string | number, data: UpdateAdminRequest): Promise<ApiResponse<AdminUser>> => {
        return api.patch<AdminUser>(`/admins/${id}`, data);
    },

    // Update admin roles
    updateRoles: async (id: string | number, data: UpdateAdminRolesRequest): Promise<ApiResponse<AdminUser>> => {
        return api.patch<AdminUser>(`/admins/${id}/roles`, data);
    },

    // Delete an admin by ID
    delete: (id: string | number): Promise<ApiResponse<void>> => {
        return api.delete<void>(`/admins/${id}`);
    },

    // Get admin statistics
    getStatistics: (): Promise<ApiResponse<{
        total: number;
        adminsWithRoles: number;
        recentlyAdded: number;
        recentlyUpdated: number;
    }>> => {
        return api.get(`/admins/statistics`, { showLoading: false });
    },

    // Assign roles to admin (alias of updateRoles for convenience)
    assignRoles: async (adminId: string | number, roleIds: number[]): Promise<ApiResponse<AdminUser>> => {
        return api.patch<AdminUser>(`/admins/${adminId}/roles`, { role_ids: roleIds });
    },
};