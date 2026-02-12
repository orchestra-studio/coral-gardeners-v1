/**
 * Project Creation Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { projectManagementApi } from '@/lib/api/projects';
import { projectKeys } from '../../keys/projectKeys';
import { CreateProjectDto, Project } from '../../types/projectTypes';
import { ApiResponse } from '@/lib/api/client';

/**
 * Transform DTO to API payload format
 */
function transformCreateDtoToPayload(dto: CreateProjectDto) {
    return {
        translations: dto.translations,
        status: dto.status,
        version: dto.version,
        image: dto.image,
        icon_name: dto.icon_name,
    };
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<Project>, Error, CreateProjectDto>({
        mutationFn: async (data: CreateProjectDto) => {
            const payload = transformCreateDtoToPayload(data);
            const response = await projectManagementApi.create(payload);

            if (!response.success) {
                throw new Error(response.message || 'Failed to create project');
            }

            return response;
        },
        onSuccess: (response) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate all project queries to refresh data
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
            toast.error(errorMessage);
        },
    });
}
