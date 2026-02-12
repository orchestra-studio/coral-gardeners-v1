"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAIChat } from "./useAIChat";
import { useAIModels } from "./useAIModels";
import { useSessionUrl } from "./useSessionUrl";
import { useServerMessages } from "./useServerMessages";
import { useSessionHydration } from "./useSessionHydration";
import { useSessionActions } from "./useSessionActions";
import { useMessagePagination } from "./useMessagePagination";
import {
    useChatSessionsList,
    useChatSession,
    useChatSessionMessages,
    fetchChatSession
} from "@/services/aiChat";
import { chatSessionsKeys } from "@/services/aiChat/keys/chatSessionsKeys";
import type { SessionsListResponse } from "@/lib/api/aiChat/chatSessionsTypes";

interface ChatFormData {
    message: string;
}

export function useChatPage() {
    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<number | undefined>();
    const queryClient = useQueryClient();

    const { register, handleSubmit: handleFormSubmit, watch, reset: resetForm } = useForm<ChatFormData>({
        defaultValues: {
            message: "",
        },
    });

    const messageValue = watch("message");

    // AI Chat & Models
    const {
        messages,
        streamingMessage,
        reasoning,
        isLoading,
        status,
        errorMessage,
        sendMessage,
        startNewSession,
        loadSession,
        currentSessionId,
        stop,
        stopAndDiscardStream,
    } = useAIChat();

    const {
        providers,
        models,
        selectedModel,
        selectedModelData,
        setSelectedModel,
        isLoading: modelsLoading,
    } = useAIModels();

    // Session data
    const { data: sessionsData, isLoading: sessionsLoading } = useChatSessionsList({
        archived: false,
        page: 1,
        limit: 50,
    });

    const activeSessionId = selectedSessionId ?? currentSessionId ?? undefined;
    const { data: selectedSession } = useChatSession(activeSessionId);

    // Messages with pagination
    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        isFetching: isFetchingMessages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useChatSessionMessages(activeSessionId, 15);

    const isInitialMessagesLoading = isLoadingMessages && !isFetchingNextPage;

    const serverMessages = useServerMessages(messagesData);

    // URL synchronization
    const { updateUrl, initialSessionId } = useSessionUrl(currentSessionId, (sessionId) => {
        if (sessionId === null) {
            // URL was cleared, ensure we're in a new session state
            setSelectedSessionId(undefined);
        } else {
            setSelectedSessionId(sessionId);
        }
    });

    // Session hydration (loading server messages into UI)
    const { resetHydration } = useSessionHydration({
        activeSessionId,
        serverMessages,
        isLoadingMessages,
        isFetchingMessages,
        isFetchingNextPage,
        selectedSessionId,
        loadSession,
        selectedSessionModel: selectedSession?.model,
        currentModel: selectedModel,
        setSelectedModel,
        onHydrationComplete: () => setSelectedSessionId(undefined),
    });

    // Message pagination
    const {
        hasMoreMessages,
        remainingMessages,
        loadOlderMessages,
        loadAllMessages,
    } = useMessagePagination({
        messagesData,
        activeSessionId,
        hasNextPage,
        isFetchingNextPage,
        serverMessagesCount: serverMessages.length,
        fetchNextPage,
    });

    const showInitialSkeleton = useMemo(() => {
        // Only show skeleton when explicitly loading an existing session:
        // - selectedSessionId is set (user clicked on a session from history)
        // - OR page was initially loaded with a session in the URL
        if (selectedSessionId !== undefined) {
            return true;
        }
        // If there's an initial session ID from URL AND we don't have a currentSessionId yet,
        // it means we're loading the page for the first time with a session
        if (initialSessionId !== null && currentSessionId === null) {
            return true;
        }
        // Don't show skeleton for newly created sessions
        return false;
    }, [selectedSessionId, initialSessionId, currentSessionId]);

    // Map sessions to expected format
    const sessions = useMemo(() => (sessionsData?.data || []).map((session) => ({
        id: session.id,
        title: session.title,
        model: session.model,
        messages: [],
        created_at: new Date(session.createdAt),
        updated_at: new Date(session.updatedAt),
        is_archived: session.isArchived,
    })), [sessionsData]);

    // Handlers
    const handleSubmit = useCallback(async (data: ChatFormData) => {
        if (!selectedModelData) return;
        const content = data.message.trim();
        if (!content) return;

        resetForm();
        await sendMessage(content, selectedModel, selectedModelData.provider);
    }, [selectedModelData, sendMessage, selectedModel, resetForm]);

    const handleNewChat = useCallback(() => {
        // Stop and discard any ongoing stream first
        stopAndDiscardStream();

        // Reset hydration state
        resetHydration();

        // Clear selected session to prevent re-hydration
        setSelectedSessionId(undefined);

        // Start fresh session (clears messages again to ensure clean state)
        startNewSession();

        // Update UI state
        setHistoryOpen(false);
        updateUrl(null);
    }, [resetHydration, startNewSession, updateUrl, stopAndDiscardStream]); const handleSelectSession = useCallback(async (sessionId: number) => {
        // Stop and discard any ongoing stream to prevent it from appearing in new session
        if (isLoading) {
            stopAndDiscardStream();
        }
        resetHydration();
        setSelectedSessionId(sessionId);
        setHistoryOpen(false);
        updateUrl(sessionId);

        // Clear current UI messages immediately so skeleton can render while new data loads
        loadSession(sessionId, []);

        // Fetch the latest session detail from backend
        const session = await queryClient.fetchQuery({
            queryKey: chatSessionsKeys.detail(sessionId),
            queryFn: () => fetchChatSession(sessionId),
            staleTime: 0,
        });

        if (!session) {
            return;
        }

        // Ensure detail cache is up to date
        queryClient.setQueryData(chatSessionsKeys.detail(sessionId), session);

        // Optimistically update all session lists in cache to move the session to the top
        queryClient.setQueriesData<SessionsListResponse>({ queryKey: chatSessionsKeys.lists() }, (existing) => {
            if (!existing) {
                return existing;
            }

            const existingIndex = existing.data.findIndex((item) => item.id === session.id);

            if (existingIndex === -1) {
                // Session not in this page of results; leave unchanged
                return existing;
            }

            const updatedSession = {
                ...existing.data[existingIndex],
                ...session,
            };

            const updatedData = [updatedSession, ...existing.data.filter((item) => item.id !== session.id)];

            return {
                ...existing,
                data: updatedData,
            };
        });

        // Background refetch to reconcile with server state (in case of pagination changes)
        await queryClient.invalidateQueries({ queryKey: chatSessionsKeys.lists() });
    }, [isLoading, stopAndDiscardStream, resetHydration, updateUrl, loadSession, queryClient]);

    // Session actions - provide callback for when current session is deleted
    const {
        handleDeleteSession,
        handleArchiveSession,
        handleRenameSession,
    } = useSessionActions(currentSessionId, handleNewChat, handleSelectSession);

    return {
        // State
        historyOpen,
        setHistoryOpen,

        // Form
        register,
        handleFormSubmit,
        messageValue,
        hasMessageContent: !!messageValue?.trim(),

        // AI Chat
        messages,
        streamingMessage,
        reasoning,
        isLoading,
        status,
        errorMessage,
        currentSessionId,
        isInitialMessagesLoading,
        hasMoreMessages,
        remainingMessages,
        isLoadingOlder: isFetchingNextPage,
        showInitialSkeleton,

        // AI Models
        providers,
        models,
        selectedModel,
        selectedModelData,
        setSelectedModel,
        modelsLoading,

        // Sessions
        sessions,
        sessionsLoading,

        // Actions
        handleSubmit,
        handleNewChat,
        handleSelectSession,
        handleDeleteSession,
        handleArchiveSession,
        handleRenameSession,
        stop,
        loadOlderMessages,
        loadAllMessages,
    };
}
