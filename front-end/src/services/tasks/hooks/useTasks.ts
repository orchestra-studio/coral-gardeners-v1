/**
 * Tasks Query Hooks
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { taskManagementApi } from '@/lib/api/tasks';
import { taskKeys } from '../keys/taskKeys';
import type {
    Task,
    TaskHistory,
    TaskStats,
    TasksListParams,
} from '@/lib/api/tasks/types';

// Type for paginated tasks data
export interface PaginatedTasksData {
    tasks: Task[];
    pagination: {
        page: number;
        totalPages: number;
        limit: number;
        total: number;
    };
}

/**
 * Hook to fetch all tasks for the authenticated admin with pagination
 */
export const useTasks = (params?: TasksListParams, enabled = true) => {
    return useQuery<PaginatedTasksData>({
        queryKey: taskKeys.list(params as Record<string, unknown>),
        queryFn: async () => {
            const response = await taskManagementApi.list(params);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch tasks');
            }

            const {
                data: tasks,
                page,
                totalPages,
                limit,
                total,
            } = response.data;

            return {
                tasks: tasks || [],
                pagination: {
                    page: page || 1,
                    totalPages: totalPages || 1,
                    limit: limit || params?.page_count || 5,
                    total: total || 0,
                },
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: enabled,
    });
};

/**
 * Hook to fetch tasks with history (active and completed separately)
 */
export const useTasksHistory = (enabled = true) => {
    return useQuery<TaskHistory>({
        queryKey: taskKeys.history(),
        queryFn: async () => {
            const response = await taskManagementApi.getHistory();
            return (
                response.data || {
                    active: [],
                    completed: [],
                    total: 0,
                }
            );
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: enabled,
    });
};

/**
 * Hook to fetch task statistics
 */
export const useTaskStats = (enabled = true) => {
    return useQuery<TaskStats>({
        queryKey: taskKeys.stats(),
        queryFn: async () => {
            const response = await taskManagementApi.getStats();
            return (
                response.data || {
                    total: 0,
                    completed: 0,
                    active: 0,
                    completionRate: 0,
                }
            );
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: enabled,
    });
};

/**
 * Hook to fetch a single task by ID
 */
export const useTask = (id: number, enabled: boolean = true) => {
    return useQuery<Task | null>({
        queryKey: taskKeys.detail(id),
        queryFn: async () => {
            const response = await taskManagementApi.getById(id);
            return response.data || null;
        },
        enabled: enabled && id > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
