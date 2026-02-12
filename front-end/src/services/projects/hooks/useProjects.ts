/**
 * Projects Query Hooks
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { projectsManagementApi } from '@/lib/api/projects';
import { projectKeys } from '../keys/projectKeys';
import { Project, ProjectsFilters } from '../types/projectTypes';

// Type for paginated projects data (matching users pattern)
export interface PaginatedProjectsData {
    projects: Project[];
    pagination: {
        page: number;
        totalPages: number;
        limit: number;
        total: number;
    };
}

/**
 * Hook to fetch paginated list of projects with filters
 */
export const useProjects = (filters: ProjectsFilters = {}, enabled = true) => {
    return useQuery<PaginatedProjectsData>({
        queryKey: projectKeys.list(filters as Record<string, unknown>),
        queryFn: async () => {
            const response = await projectsManagementApi.list(filters);

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch projects');
            }

            // The API returns paginated data in response.data
            const apiData = response.data as unknown as {
                data: Project[];
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };

            return {
                projects: apiData.data || [],
                pagination: {
                    page: apiData.page,
                    totalPages: apiData.totalPages,
                    limit: apiData.limit,
                    total: apiData.total,
                },
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: enabled,
    });
};

/**
 * Hook to fetch a single project by ID
 */
/**
 * Hook to fetch a single project by ID
 */
export const useProject = (id?: string | number) => {
    const projectId = typeof id === 'string' ? parseInt(id, 10) : id;

    return useQuery<Project | null>({
        queryKey: projectKeys.detail(projectId as number),
        queryFn: async () => {
            if (!projectId || isNaN(projectId)) return null;

            const response = await projectsManagementApi.getById(projectId);

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch project');
            }

            return response.data as Project;
        },
        enabled: !!projectId && !isNaN(projectId),
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook to fetch paginated list of deleted projects with filters
 */
export const useDeletedProjects = (filters: Omit<ProjectsFilters, 'status' | 'environment'> = {}, enabled = true) => {
    return useQuery<PaginatedProjectsData>({
        queryKey: projectKeys.deleted(filters as Record<string, unknown>),
        queryFn: async () => {
            const response = await projectsManagementApi.listDeleted(filters);

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch deleted projects');
            }

            // The API returns paginated data in response.data
            const apiData = response.data as unknown as {
                data: Project[];
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };

            return {
                projects: apiData.data || [],
                pagination: {
                    page: apiData.page,
                    totalPages: apiData.totalPages,
                    limit: apiData.limit,
                    total: apiData.total,
                },
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: enabled,
    });
};