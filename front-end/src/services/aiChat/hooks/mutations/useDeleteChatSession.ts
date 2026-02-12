/**
 * Delete Chat Session Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { chatSessionsApi } from '@/lib/api/aiChat/chatSessions';
import { chatSessionsKeys } from '../../keys/chatSessionsKeys';
import { aiChatKeys } from '../../keys/aiChatKeys';

export function useDeleteChatSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await chatSessionsApi.delete(id);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete session');
            }
            return response;
        },
        onSuccess: () => {
            // Invalidate both old and new query keys
            queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to delete chat session';
            toast.error(errorMessage);
        },
    });
}
