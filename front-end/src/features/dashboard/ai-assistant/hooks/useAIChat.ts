import { useCallback, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, ReasoningMessage } from "@/types/ai-chat";
import type { ChatMessage as ApiChatMessage } from "@/lib/api/aiChat/chatSessionsTypes";
import { processMessages } from "./utils/message-processor";
import { useCreateChatSession, useChatTransport } from "@/services/aiChat";
import { chatSessionsKeys } from "@/services/aiChat/keys/chatSessionsKeys";
import { useSessionManager } from "./utils/session-manager";
import { useTimestamps } from "./utils/timestamps";
import { useMessageAutoSave } from "./utils/message-saver";
import { useErrorFormatter } from "./utils/error-formatter";

/**
 * Main hook for AI chat functionality
 * Provides messaging, session management, and persistence capabilities
 * 
 * @returns Chat interface with messages, send/load functions, and status
 */
export function useAIChat() {
    const createSession = useCreateChatSession();
    const transport = useChatTransport();
    const queryClient = useQueryClient();

    // Track the session ID that the current stream belongs to
    const streamingSessionIdRef = useRef<number | null>(null);

    // Flag to track if we've discarded the current chat (prevents messages from reappearing)
    const isDiscardedRef = useRef<boolean>(false); const {
        messages: uiMessages,
        sendMessage: rawSendMessage,
        setMessages,
        status,
        error,
        stop,
    } = useChat({
        id: "dashboard-ai-chat",
        transport,
        experimental_throttle: 32,
    });

    const { getTimestamp, clearTimestamps } = useTimestamps();
    const {
        currentSessionId,
        setCurrentSessionId,
        sessionIdRef,
        lastMessageCountRef,
        isSavingRef,
        loadSession: loadSessionInternal,
    } = useSessionManager(setMessages);

    // Wrap loadSession to also clear the discarded flag
    const loadSession = useCallback((sessionId: number, sessionMessages: ApiChatMessage[]) => {
        // Clear discarded flag when loading a session
        isDiscardedRef.current = false;
        loadSessionInternal(sessionId, sessionMessages);
    }, [loadSessionInternal]);

    const derived = useMemo(() => {
        // If chat was discarded, return empty state regardless of uiMessages
        if (isDiscardedRef.current) {
            return {
                history: [],
                streamingEntry: null,
                streamingId: null,
                reasoning: null,
            };
        }
        return processMessages(uiMessages, getTimestamp);
    }, [uiMessages, getTimestamp]);

    const isLoading = status === "submitted" || status === "streaming";
    const errorMessage = useErrorFormatter(error);

    // Auto-save messages to session after each interaction
    useMessageAutoSave(sessionIdRef, streamingSessionIdRef, lastMessageCountRef, isSavingRef, derived.history, isLoading);

    const sendMessage = useCallback(
        async (content: string, model: string, provider: string) => {
            const trimmed = content.trim();
            if (!trimmed) {
                return;
            }

            // Clear discarded flag when starting a new message
            isDiscardedRef.current = false;

            // Create session if this is the first message
            if (!sessionIdRef.current && !createSession.isPending) {
                try {
                    const response = await createSession.mutateAsync({
                        title: "New Chat",
                        model,
                        provider,
                    });
                    if (response.success && response.data) {
                        sessionIdRef.current = response.data.id;
                        setCurrentSessionId(response.data.id);

                        // Invalidate all session queries to trigger refetch
                        await queryClient.invalidateQueries({
                            queryKey: chatSessionsKeys.all,
                            refetchType: 'active'
                        });
                    }
                } catch (error) {
                    console.error("Failed to create session:", error);
                    // Continue anyway - chat will work without persistence
                }
            }

            // Capture the session ID at send time (before streaming starts)
            streamingSessionIdRef.current = sessionIdRef.current;

            await rawSendMessage(
                { text: trimmed },
                {
                    body: { model, provider },
                },
            );
        },
        [rawSendMessage, createSession, sessionIdRef, setCurrentSessionId, queryClient],
    ); const clearMessages = useCallback(() => {
        // Don't reset isDiscardedRef here - let it stay true until new message is sent
        clearTimestamps();
        setMessages([]);
        setCurrentSessionId(null);
        sessionIdRef.current = null;
        streamingSessionIdRef.current = null;
        lastMessageCountRef.current = 0;
    }, [setMessages, clearTimestamps, setCurrentSessionId, sessionIdRef, lastMessageCountRef]);

    const startNewSession = useCallback(() => {
        clearMessages();
    }, [clearMessages]);

    const stopAndDiscardStream = useCallback(() => {
        // Set discarded flag to prevent any messages from appearing
        isDiscardedRef.current = true;

        // Mark streaming session as null to prevent any ongoing saves
        streamingSessionIdRef.current = null;

        // Prevent any auto-save attempts
        isSavingRef.current = false;

        // Stop the stream and clear all messages
        stop();
        setMessages([]);

        // Reset all session state
        setCurrentSessionId(null);
        sessionIdRef.current = null;
        lastMessageCountRef.current = 0;

        // Clear timestamps to prevent any stale timestamp references
        clearTimestamps();
    }, [stop, setMessages, setCurrentSessionId, clearTimestamps, lastMessageCountRef, isSavingRef, sessionIdRef]); const streamingDisplay: ChatMessage | null = derived.streamingEntry ?? null;
    const reasoning: ReasoningMessage | null = derived.reasoning;

    return {
        messages: derived.history,
        streamingMessage: streamingDisplay,
        reasoning,
        streamingMessageId: streamingDisplay?.id ?? null,
        isLoading,
        status,
        errorMessage,
        sendMessage,
        clearMessages,
        startNewSession,
        loadSession,
        currentSessionId,
        stop,
        stopAndDiscardStream,
    };
}
