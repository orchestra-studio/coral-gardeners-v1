/**
 * Tasks Mutation Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskManagementApi } from '@/lib/api/tasks';
import { taskKeys } from '../keys/taskKeys';
import type { CreateTaskDto, UpdateTaskDto } from '@/lib/api/tasks/types';
import { toast } from 'react-toastify';

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateTaskDto) => {
            const response = await taskManagementApi.create(data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            queryClient.invalidateQueries({ queryKey: taskKeys.history() });
            // Use backend message if available
            toast.success(response.message || 'Task created successfully');
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to create task');
        },
    });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateTaskDto }) => {
            const response = await taskManagementApi.update(id, data);
            return { response, id };
        },
        onSuccess: ({ response, id }) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            queryClient.invalidateQueries({ queryKey: taskKeys.history() });
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
            // Use backend message if available
            toast.success(response.message || 'Task updated successfully');
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to update task');
        },
    });
};

/**
 * Hook to toggle task completion status
 */
export const useToggleTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await taskManagementApi.toggle(id);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            queryClient.invalidateQueries({ queryKey: taskKeys.history() });
            // Use backend message if available
            toast.success(response.message || 'Task status updated');
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to update task status');
        },
    });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await taskManagementApi.delete(id);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            queryClient.invalidateQueries({ queryKey: taskKeys.history() });
            // Use backend message if available
            toast.success(response.message || 'Task deleted successfully');
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to delete task');
        },
    });
};
