/**
 * Chat Sessions API Types
 */

import type { ToolMessageBlock } from '@/types/ai-chat';

export interface ChatSession {
    id: number;
    title: string;
    userId?: number;
    model: string;
    provider: string;
    messagesCount: number;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
}

export interface SessionMessagesResponse {
    data: ChatMessage[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

export interface ChatMessage {
    id: number;
    sessionId: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    blocks?: ToolMessageBlock[];
    createdAt: string;
}

export interface ChatSessionWithMessages extends ChatSession {
    messages: ChatMessage[];
}

export interface CreateSessionPayload {
    title?: string;
    model: string;
    provider: string;
}

export interface UpdateSessionPayload {
    title?: string;
    isArchived?: boolean;
}

export interface SaveMessagesPayload {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
        blocks?: ToolMessageBlock[];
    }>;
}

export interface ListSessionsParams {
    page?: number;
    limit?: number;
    search?: string;
    archived?: boolean;
}

export interface SessionsListResponse {
    data: ChatSession[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ============ LLM Models & Providers Types ============

export interface ChatConfig {
    providers: LLMProvider[];
    models: LLMModel[];
}

export interface LLMModel {
    id: string;
    name: string;
    provider: string;
    contextWindow: number;
    description?: string;
    maxTokens?: number;
}

export interface LLMProvider {
    id: string;
    name: string;
    models: LLMModel[];
    baseURL?: string;
    requiresApiKey: boolean;
}

export interface StreamChatParams {
    messages: ChatMessage[];
    model: string;
    provider: string;
}