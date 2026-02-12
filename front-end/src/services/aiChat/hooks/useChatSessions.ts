/**
 * Chat Sessions TanStack Query Hooks - Queries Only
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { chatSessionsApi } from '@/lib/api/aiChat/chatSessions';
import type {
    ChatSession,
    ListSessionsParams,
    SessionsListResponse,
} from '@/lib/api/aiChat/chatSessionsTypes';
import { chatSessionsKeys } from '../keys/chatSessionsKeys';

/**
 * Shared fetcher for a sessions list so all consumers go through the services layer
 */
export async function fetchChatSessionsList(filters: ListSessionsParams = {}) {
    const response = await chatSessionsApi.list(filters);
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch chat sessions');
    }
    return response.data;
}

/**
 * Shared fetcher for a single chat session detail
 */
export async function fetchChatSession(sessionId: number): Promise<ChatSession | null> {
    const response = await chatSessionsApi.get(sessionId);
    if (!response.success) {
        throw new Error(response.message || 'Failed to fetch chat session');
    }
    return response.data || null;
}

/**
 * Hook to get all chat sessions with optional filters
 */
export function useChatSessions(
    filters: ListSessionsParams = {},
    enabled = true,
) {
    return useQuery<SessionsListResponse>({
        queryKey: chatSessionsKeys.list(filters as Record<string, unknown>),
        queryFn: () => fetchChatSessionsList(filters),
        placeholderData: keepPreviousData,
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: enabled,
    });
}

/**
 * Hook to get a single chat session (without messages)
 */
export function useChatSession(sessionId?: number) {
    const query = useQuery<ChatSession | null>({
        queryKey: chatSessionsKeys.detail(sessionId!),
        queryFn: () => fetchChatSession(sessionId!),
        enabled: !!sessionId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    return query;
}
