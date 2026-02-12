import { useCallback } from 'react';
import {
    useTasksHistory,
    useCreateTask,
    useToggleTask,
    useDeleteTask,
    useUpdateTask,
} from '@/services/tasks';
import type { Task } from '@/lib/api/tasks/types';

// Re-export Task type as QuickTask for component compatibility
export type QuickTask = Task;

export function useQuickTasks() {
    const { data, isLoading, isFetching } = useTasksHistory(true);

    const isInitialLoading = !data && isLoading;
    const isRefreshing = Boolean(data) && isFetching;

    const activeTasks = data?.active ?? [];
    const completedTasks = data?.completed ?? [];
    const totalTasks = (data?.total ?? 0) || activeTasks.length + completedTasks.length;

    const createTaskMutation = useCreateTask();
    const toggleTaskMutation = useToggleTask();
    const deleteTaskMutation = useDeleteTask();
    const updateTaskMutation = useUpdateTask();

    const addTask = useCallback(
        async (text: string) => {
            if (!text.trim()) return;
            await createTaskMutation.mutateAsync({
                text: text.trim(),
                completed: false,
            });
        },
        [createTaskMutation]
    );

    const toggleTask = useCallback(
        async (id: number) => {
            await toggleTaskMutation.mutateAsync(id);
        },
        [toggleTaskMutation]
    );

    const deleteTask = useCallback(
        async (id: number) => {
            await deleteTaskMutation.mutateAsync(id);
        },
        [deleteTaskMutation]
    );

    const updateTask = useCallback(
        async (id: number, text: string) => {
            await updateTaskMutation.mutateAsync({
                id,
                data: { text },
            });
        },
        [updateTaskMutation]
    );

    return {
        activeTasks,
        completedTasks,
        totalTasks,
        isInitialLoading,
        isRefreshing,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        isCreating: createTaskMutation.isPending,
        isToggling: toggleTaskMutation.isPending,
        isDeleting: deleteTaskMutation.isPending,
        isUpdating: updateTaskMutation.isPending,
    };
}
