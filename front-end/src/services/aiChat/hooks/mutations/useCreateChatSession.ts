/**
 * Create Chat Session Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { chatSessionsApi } from '@/lib/api/aiChat/chatSessions';
import type { CreateSessionPayload } from '@/lib/api/aiChat/chatSessionsTypes';
import { chatSessionsKeys } from '../../keys/chatSessionsKeys';
import { aiChatKeys } from '../../keys/aiChatKeys';

export type { CreateSessionPayload as CreateSessionRequest };

export function useCreateChatSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sessionData: CreateSessionPayload) => {
            const response = await chatSessionsApi.create(sessionData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create session');
            }
            return response;
        },
        onSuccess: (response) => {
            // Don't show toast - session creation is automatic
            // Invalidate both old and new query keys
            queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.all });
            return response.data;
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to create chat session';
            toast.error(errorMessage);
        },
    });
}
