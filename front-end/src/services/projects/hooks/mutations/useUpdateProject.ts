/**
 * Project Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { projectManagementApi } from '@/lib/api/projects';
import { projectKeys } from '../../keys/projectKeys';
import { UpdateProjectDto, Project } from '../../types/projectTypes';
import { ApiResponse } from '@/lib/api/client';

/**
 * Transform DTO to API payload format
 */
function transformUpdateDtoToPayload(dto: UpdateProjectDto) {
    return {
        translations: dto.translations,
        status: dto.status,
        version: dto.version,
        image: dto.image,
        icon_name: dto.icon_name,
    };
}

/**
 * Hook to update an existing project
 */
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<Project>, Error, { id: number; data: UpdateProjectDto }>({
        mutationFn: async ({ id, data }) => {
            const payload = transformUpdateDtoToPayload(data);
            const response = await projectManagementApi.update(id, payload);

            if (!response.success) {
                throw new Error(response.message || 'Failed to update project');
            }

            return response;
        },
        onSuccess: (response, variables) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }

            // Invalidate all project queries to refresh data
            queryClient.invalidateQueries({ queryKey: projectKeys.all });

            // Invalidate specific project detail
            queryClient.invalidateQueries({
                queryKey: projectKeys.detail(variables.id)
            });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
            toast.error(errorMessage);
        },
    });
}
