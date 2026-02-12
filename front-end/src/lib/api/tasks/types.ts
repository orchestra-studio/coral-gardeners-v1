/**
 * Task API Types
 */

import type { ApiResponse } from '@/lib/api/client';
export interface Task {
    id: number;
    text: string;
    completed: boolean;
    adminId: number;
    createdAt: string;
    updatedAt: string;
}

export interface TaskStats {
    total: number;
    completed: number;
    active: number;
    completionRate: number;
}

export interface TaskHistory {
    active: Task[];
    completed: Task[];
    total: number;
}

export interface CreateTaskDto {
    text: string;
    completed?: boolean;
}

export interface UpdateTaskDto {
    text?: string;
    completed?: boolean;
}

// Pagination types
export interface TasksListParams {
    page?: number;
    page_count?: number;
    status?: 'active' | 'completed' | 'all';
}

export interface TasksPaginatedData {
    data: Task[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export type TasksPaginatedResponse = ApiResponse<TasksPaginatedData>;
