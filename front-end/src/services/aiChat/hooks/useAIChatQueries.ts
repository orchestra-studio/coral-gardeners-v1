/**
 * AI Chat TanStack Query Hooks - Queries Only
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { chatSessionsApi, aiChatConfigApi } from '@/lib/api';
import { aiChatKeys } from '../keys/aiChatKeys';
import type { ChatConfig, ChatSession, SessionMessagesResponse } from '@/lib/api/aiChat/chatSessionsTypes';

/**
 * Hook to get available AI models and providers
 */
export function useAIChatModels() {
    return useQuery<ChatConfig>({
        queryKey: aiChatKeys.models(),
        queryFn: async () => {
            const response = await aiChatConfigApi.getModels();
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch models');
        },
        staleTime: 30 * 60 * 1000, // 30 minutes - models don't change often
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to get user's chat sessions
 * Uses NEW chat-sessions API endpoint
 */
export function useChatSessions() {
    return useQuery<ChatSession[]>({
        queryKey: aiChatKeys.sessions(),
        queryFn: async () => {
            const response = await chatSessionsApi.list(); // ✅ NEW API
            if (response.success && response.data) {
                return response.data.data; // Extract data array from paginated response
            }
            return [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to get a specific chat session (without messages)
 */
export function useChatSession(id?: number) {
    return useQuery<ChatSession>({
        queryKey: aiChatKeys.session(id!),
        queryFn: async () => {
            const response = await chatSessionsApi.get(id!);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error('Failed to fetch session');
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to get paginated messages for a session
 * Uses infinite query for "load more" functionality
 */
export function useChatSessionMessages(sessionId?: number, initialLimit = 30) {
    return useInfiniteQuery<SessionMessagesResponse>({
        queryKey: aiChatKeys.sessionMessages(sessionId!),
        queryFn: async ({ pageParam = 1 }) => {
            const response = await chatSessionsApi.getMessages(sessionId!, {
                page: pageParam as number,
                limit: initialLimit,
            });
            if (response.success && response.data) {
                // response.data already contains the full SessionMessagesResponse structure
                return response.data;
            }
            throw new Error('Failed to fetch messages');
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.page + 1 : undefined;
        },
        enabled: !!sessionId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: false,
    });
}
