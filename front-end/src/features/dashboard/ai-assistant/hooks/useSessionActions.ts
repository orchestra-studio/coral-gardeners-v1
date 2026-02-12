import { useCallback } from "react";
import {
    useDeleteChatSession,
    useUpdateChatSession,
} from "@/services/aiChat";

/**
 * Provides handlers for session management actions
 */
export function useSessionActions(
    currentSessionId: number | null,
    onDeleteCurrentSession?: () => void,
    onRenameSuccess?: (sessionId: number) => Promise<void> | void,
) {
    const deleteSession = useDeleteChatSession();
    const updateSession = useUpdateChatSession();

    const handleDeleteSession = useCallback((sessionId: number) => {
        const isDeletingCurrentSession = currentSessionId === sessionId;

        deleteSession.mutate(sessionId, {
            onSuccess: () => {
                // If deleted session is current session, start new conversation
                if (isDeletingCurrentSession && onDeleteCurrentSession) {
                    onDeleteCurrentSession();
                }
            }
        });
    }, [deleteSession, currentSessionId, onDeleteCurrentSession]);

    const handleArchiveSession = useCallback((sessionId: number) => {
        updateSession.mutate({
            id: sessionId,
            isArchived: true
        });
    }, [updateSession]);

    const handleRenameSession = useCallback((sessionId: number, newTitle: string) => {
        updateSession.mutate({
            id: sessionId,
            title: newTitle
        }, {
            onSuccess: async () => {
                if (onRenameSuccess) {
                    await onRenameSuccess(sessionId);
                }
            }
        });
    }, [updateSession, onRenameSuccess]);

    return {
        handleDeleteSession,
        handleArchiveSession,
        handleRenameSession,
    };
}
