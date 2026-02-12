/**
 * Task Management API
 * CRUD operations for tasks
 */

import { isAxiosError } from 'axios';
import { api, apiClient, ApiRequestConfig, ApiResponse, handleApiError } from '../client';
import type {
    Task,
    TaskStats,
    TaskHistory,
    CreateTaskDto,
    UpdateTaskDto,
    TasksListParams,
    TasksPaginatedData,
    TasksPaginatedResponse,
} from './types';

export const taskManagementApi = {
    // List all tasks for authenticated admin with pagination
    list: async (params?: TasksListParams): Promise<TasksPaginatedResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_count) queryParams.append('page_count', params.page_count.toString());
        if (params?.status) queryParams.append('status', params.status);

        const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        try {
            const response = await apiClient.get(url, { showLoading: false } as ApiRequestConfig);
            const payload = response.data as {
                success?: unknown;
                message?: unknown;
                data?: unknown;
                limit?: unknown;
                page?: unknown;
                total?: unknown;
                totalPages?: unknown;
            };

            const success = payload.success === undefined ? true : Boolean(payload.success);
            if (!success) {
                const message = typeof payload.message === 'string' && payload.message.length
                    ? payload.message
                    : 'Failed to fetch tasks';
                throw new Error(message);
            }

            const toNumber = (value: unknown, fallback: number): number => {
                if (typeof value === 'number' && !Number.isNaN(value)) return value;
                if (typeof value === 'string') {
                    const parsed = Number(value);
                    if (!Number.isNaN(parsed)) {
                        return parsed;
                    }
                }
                return fallback;
            };

            const tasks = Array.isArray(payload.data) ? (payload.data as Task[]) : [];
            const limit = toNumber(payload.limit, params?.page_count ?? 5);
            const total = toNumber(payload.total, tasks.length);
            const page = toNumber(payload.page, params?.page ?? 1);
            const totalPages = toNumber(
                payload.totalPages,
                limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1
            );

            const normalized: TasksPaginatedData = {
                data: tasks,
                page,
                limit,
                total,
                totalPages,
            };

            return {
                success: true,
                data: normalized,
                message: typeof payload.message === 'string' && payload.message.length
                    ? payload.message
                    : undefined,
            } satisfies TasksPaginatedResponse;
        } catch (error) {
            if (isAxiosError(error)) {
                const handled = handleApiError(error);
                throw new Error(handled.message || 'Failed to fetch tasks');
            }
            throw error instanceof Error ? error : new Error('Failed to fetch tasks');
        }
    },

    // Get tasks with history (active and completed split)
    getHistory: (): Promise<ApiResponse<TaskHistory>> => {
        return api.get<TaskHistory>('/tasks/history', { showLoading: false });
    },

    // Get task statistics
    getStats: (): Promise<ApiResponse<TaskStats>> => {
        return api.get<TaskStats>('/tasks/stats', { showLoading: false });
    },

    // Get a single task by ID
    getById: (id: number): Promise<ApiResponse<Task>> => {
        return api.get<Task>(`/tasks/${id}`);
    },

    // Create a new task
    create: (data: CreateTaskDto): Promise<ApiResponse<Task>> => {
        return api.post<Task>('/tasks', data);
    },

    // Update a task
    update: (id: number, data: UpdateTaskDto): Promise<ApiResponse<Task>> => {
        return api.patch<Task>(`/tasks/${id}`, data);
    },

    // Toggle task completion status
    toggle: (id: number): Promise<ApiResponse<Task>> => {
        return api.patch<Task>(`/tasks/${id}/toggle`);
    },

    // Delete a task
    delete: (id: number): Promise<ApiResponse<null>> => {
        return api.delete<null>(`/tasks/${id}`);
    },
};

// Export individual functions for convenience
export const {
    list: listTasks,
    getHistory: getTasksHistory,
    getStats: getTaskStats,
    getById: getTaskById,
    create: createTask,
    update: updateTask,
    toggle: toggleTask,
    delete: deleteTask,
} = taskManagementApi;
