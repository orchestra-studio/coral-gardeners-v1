/**
 * Chat Sessions Mutations
 * TanStack Query mutations for chat session operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatSessionsApi } from '@/lib/api/aiChat/chatSessions';
import type {
    CreateSessionPayload,
    UpdateSessionPayload,
    SaveMessagesPayload,
} from '@/lib/api/aiChat/chatSessionsTypes';
import { toast } from 'react-toastify';
import { chatSessionsKeys } from '../../keys/chatSessionsKeys';

/**
 * Hook to create a new chat session
 */
export function useCreateChatSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSessionPayload) => chatSessionsApi.create(data),
        onSuccess: (response) => {
            // Invalidate all session queries to show the new session immediately
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.all });

            // Also refetch active queries to update the UI immediately
            queryClient.refetchQueries({ queryKey: chatSessionsKeys.lists() });

            // Show backend message if available
            if (response.message) {
                toast.success(response.message);
            }

            return response.data;
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to create chat session');
        },
    });
}

/**
 * Hook to update a chat session (rename or archive)
 */
export function useUpdateChatSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateSessionPayload }) =>
            chatSessionsApi.update(id, data),
        onSuccess: (response) => {
            // Show backend message if available, otherwise show action-specific message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate both list and detail
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.all });
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to update chat session');
        },
    });
}

/**
 * Hook to delete a chat session
 */
export function useDeleteChatSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => chatSessionsApi.delete(id),
        onSuccess: (response) => {
            // Show backend message if available
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate sessions list
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.all });
        },
        onError: (error: Error) => {
            // Backend message is already in error.message from API client
            toast.error(error.message || 'Failed to delete chat session');
        },
    });
}

/**
 * Hook to save messages to a session
 */
export function useSaveMessages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: SaveMessagesPayload }) =>
            chatSessionsApi.saveMessages(id, data),
        onSuccess: (response, variables) => {
            // Invalidate both the session detail and the list
            // The list needs to be invalidated because the backend auto-generates
            // the title from the first message, which updates the session
            queryClient.invalidateQueries({
                queryKey: chatSessionsKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: chatSessionsKeys.lists(),
            });
        },
        onError: (error: Error) => {
            console.error('Failed to save messages:', error);
            // Don't show toast - this happens in background
        },
    });
}
