/**
 * Role Management API
 * CRUD operations for roles
 */

import { api, ApiResponse } from "../client";
import { Role } from "../types";

export const roleManagementApi = {
    // Get all roles (non-paginated)
    getRoles: (): Promise<ApiResponse<Role[]>> => {
        return api.get<Role[]>("/roles", { showLoading: false });
    },

    // Get roles for dropdown/select
    getRolesForDropdown: (): Promise<ApiResponse<Role[]>> => {
        return api.get<Role[]>("/roles/select", { showLoading: false });
    },

    // List roles with optional filters and pagination
    list: (params?: {
        page?: number;
        page_count?: number;
        name?: string;
        guard_name?: string;
        created_from?: string;
        created_to?: string;
    }): Promise<ApiResponse<Role[] | { data: Role[]; current_page: number; per_page: number; total: number; last_page: number; from: number; to: number }>> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.page_count) queryParams.append("page_count", params.page_count.toString());
        if (params?.name) queryParams.append("name", params.name);
        if (params?.guard_name) queryParams.append("guard_name", params.guard_name);
        if (params?.created_from) queryParams.append("created_from", params.created_from);
        if (params?.created_to) queryParams.append("created_to", params.created_to);

        const url = `/roles${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        return api.get(url, { showLoading: false });
    },

    // Get roles statistics
    getStatistics: (): Promise<ApiResponse<{
        total: number;
        withAdmins: number;
        withoutAdmins: number;
        recentlyAdded: number;
        recentlyUpdated: number;
    }>> => {
        return api.get("/roles/statistics", { showLoading: false });
    },

    // Create a new role
    create: (data: { name: string }): Promise<ApiResponse<Role>> => {
        return api.post<Role>("/roles", data);
    },

    // Update role details
    update: (id: string | number, data: { name: string }): Promise<ApiResponse<Role>> => {
        return api.put<Role>(`/roles/${id}`, data);
    },

    // Delete a role
    delete: (id: string | number): Promise<ApiResponse<void>> => {
        return api.delete<void>(`/roles/${id}`);
    },
};
