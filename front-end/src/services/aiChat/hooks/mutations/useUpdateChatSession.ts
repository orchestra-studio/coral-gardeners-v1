/**
 * Update Chat Session Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { chatSessionsApi } from '@/lib/api/aiChat/chatSessions';
import type { UpdateSessionPayload } from '@/lib/api/aiChat/chatSessionsTypes';
import { chatSessionsKeys } from '../../keys/chatSessionsKeys';
import { aiChatKeys } from '../../keys/aiChatKeys';

export type { UpdateSessionPayload as UpdateSessionRequest };

interface UpdateSessionParams extends UpdateSessionPayload {
    id: number;
}

export function useUpdateChatSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateSessionParams) => {
            const response = await chatSessionsApi.update(id, updates);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update session');
            }
            return { ...response, variables: { id, updates } };
        },
        onSuccess: (response: { variables: { id: number; updates: UpdateSessionPayload } }, variables: UpdateSessionParams) => {
            const { updates } = response.variables;
            if (updates.isArchived !== undefined) {
                toast.success(updates.isArchived ? 'Chat archived' : 'Chat unarchived');
            }
            // Invalidate both old and new query keys
            queryClient.invalidateQueries({ queryKey: aiChatKeys.session(variables.id) });
            queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: chatSessionsKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to update chat session';
            toast.error(errorMessage);
        },
    });
}
