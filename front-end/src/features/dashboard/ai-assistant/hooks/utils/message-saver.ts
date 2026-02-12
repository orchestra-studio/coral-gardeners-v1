import { useEffect, type MutableRefObject } from "react";
import type { ChatMessage } from "@/types/ai-chat";
import { useSaveMessages } from "@/services/aiChat";

/**
 * Hook for auto-saving chat messages to the backend
 */
export function useMessageAutoSave(
    sessionIdRef: MutableRefObject<number | null>,
    streamingSessionIdRef: MutableRefObject<number | null>,
    lastMessageCountRef: MutableRefObject<number>,
    isSavingRef: MutableRefObject<boolean>,
    messages: ChatMessage[],
    isLoading: boolean
) {
    const saveMessages = useSaveMessages();

    useEffect(() => {
        // Use the streaming session ID if available (captured at send time),
        // otherwise fall back to current session ID
        const sessionId = streamingSessionIdRef.current ?? sessionIdRef.current;

        // Only save if we have a session and new messages
        if (!sessionId || messages.length === 0) {
            return;
        }

        // Check if there are new messages since last save
        const currentCount = messages.length;
        if (currentCount <= lastMessageCountRef.current) {
            return;
        }

        // Don't save while streaming or while a save is already in progress
        if (isLoading || isSavingRef.current) {
            return;
        }

        // Get only the new messages since last save
        const newMessages = messages.slice(lastMessageCountRef.current);
        if (newMessages.length === 0) {
            return;
        }

        // Update the counter and saving flag immediately to prevent duplicate saves
        const messagesBeingSaved = currentCount;
        lastMessageCountRef.current = messagesBeingSaved;
        isSavingRef.current = true;

        // Save the new messages
        saveMessages.mutate(
            {
                id: sessionId,
                data: {
                    messages: newMessages.map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                        blocks: msg.blocks,
                    })),
                },
            },
            {
                onSettled: () => {
                    // Reset saving flag when done (success or error)
                    isSavingRef.current = false;

                    // Clear the streaming session ID after successful save
                    // This ensures subsequent session switches won't accidentally reuse it
                    streamingSessionIdRef.current = null;
                },
            }
        );
    }, [messages, isLoading, sessionIdRef, streamingSessionIdRef, lastMessageCountRef, isSavingRef, saveMessages]);
}
