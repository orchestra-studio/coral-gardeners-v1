/**
 * Projects Management API
 * CRUD operations for projects
 */

import { api, ApiResponse } from "../client";
import {
    Project,
    CreateProjectPayload,
    UpdateProjectPayload,
    ProjectsListParams,
} from "./types";

export const projectsManagementApi = {
    // List all projects with optional filters
    list: (params?: ProjectsListParams): Promise<ApiResponse<Project[]>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.page_count) queryParams.append("page_count", params.page_count.toString());
        if (params?.name) queryParams.append("name", params.name);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.environment) queryParams.append("environment", params.environment);

        const url = `/projects${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        return api.get<Project[]>(url, { showLoading: false });
    },

    // List all deleted projects with optional filters
    listDeleted: (params?: Omit<ProjectsListParams, 'status' | 'environment'>): Promise<ApiResponse<Project[]>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.page_count) queryParams.append("page_count", params.page_count.toString());
        if (params?.name) queryParams.append("name", params.name);

        const url = `/projects/deleted${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        return api.get<Project[]>(url, { showLoading: false });
    },

    // Get a single project by ID
    getById: (id: number): Promise<ApiResponse<Project>> => {
        return api.get<Project>(`/projects/${id}`);
    },

    // Create a new project
    create: (data: CreateProjectPayload): Promise<ApiResponse<Project>> => {
        return api.post<Project>("/projects", data);
    },

    // Update an existing project
    update: (id: number, data: UpdateProjectPayload): Promise<ApiResponse<Project>> => {
        return api.patch<Project>(`/projects/${id}`, data);
    },

    // Delete a project by ID
    delete: (id: number): Promise<ApiResponse<void>> => {
        return api.delete(`/projects/${id}`);
    },

    // Restore a soft-deleted project
    restore: (id: number): Promise<ApiResponse<void>> => {
        return api.post(`/projects/deleted/${id}/restore`);
    },

    // Get project statistics
    getStatistics: (): Promise<ApiResponse<{
        total: number;
        deleted: number;
        inProgress: number;
        ready: number;
        blocked: number;
    }>> => {
        return api.get("/projects/statistic", { showLoading: false });
    },
};

// Export individual functions for convenience
export const {
    list: listProjects,
    listDeleted: listDeletedProjects,
    getById: getProjectById,
    create: createProject,
    update: updateProject,
    delete: deleteProject,
    restore: restoreProject,
} = projectsManagementApi;
