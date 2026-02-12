/**
 * Chat Sessions API
 * CRUD operations for chat sessions and messages
 */

import { api, ApiResponse } from '../client';
import {
    ChatSession,
    CreateSessionPayload,
    UpdateSessionPayload,
    SaveMessagesPayload,
    ListSessionsParams,
    SessionsListResponse,
    SessionMessagesResponse,
} from './chatSessionsTypes';

export const chatSessionsApi = {
    /**
     * List all chat sessions with optional filters
     */
    list: async (
        params?: ListSessionsParams,
    ): Promise<ApiResponse<SessionsListResponse>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.archived !== undefined)
            queryParams.append('archived', params.archived.toString());

        const url = `/chat-sessions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return api.get<SessionsListResponse>(url, { showLoading: false });
    },

    /**
     * Get a single session without messages
     */
    get: (id: number): Promise<ApiResponse<ChatSession>> => {
        return api.get<ChatSession>(`/chat-sessions/${id}`, {
            showLoading: false,
        });
    },

    /**
     * Get paginated messages for a session
     */
    getMessages: async (
        sessionId: number,
        params?: { page?: number; limit?: number; before?: string },
    ): Promise<ApiResponse<SessionMessagesResponse>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.before) queryParams.append('before', params.before);

        const url = `/chat-sessions/${sessionId}/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return api.get<SessionMessagesResponse>(url, { showLoading: false });
    },

    /**
     * Create a new chat session
     */
    create: (
        data: CreateSessionPayload,
    ): Promise<ApiResponse<ChatSession>> => {
        return api.post<ChatSession>('/chat-sessions', data, {
            showLoading: false,
        });
    },

    /**
     * Update a session (rename or archive)
     */
    update: (
        id: number,
        data: UpdateSessionPayload,
    ): Promise<ApiResponse<ChatSession>> => {
        return api.patch<ChatSession>(`/chat-sessions/${id}`, data);
    },

    /**
     * Delete a session and all its messages
     */
    delete: (id: number): Promise<ApiResponse<{ message: string }>> => {
        return api.delete<{ message: string }>(`/chat-sessions/${id}`);
    },

    /**
     * Save messages to a session
     */
    saveMessages: (
        id: number,
        data: SaveMessagesPayload,
    ): Promise<ApiResponse<{ message: string }>> => {
        return api.post<{ message: string }>(
            `/chat-sessions/${id}/messages`,
            data,
            { showLoading: false },
        );
    },
};
