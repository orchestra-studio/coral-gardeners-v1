/**
 * AI Chat Configuration API
 * Endpoints for models, providers, and configuration
 */

import { api } from '../client';
import type { ApiResponse } from '../client';
import type { ChatConfig } from './chatSessionsTypes';

export const aiChatConfigApi = {
    /**
     * Get available LLM models and providers
     */
    getModels: (): Promise<ApiResponse<ChatConfig>> => {
        return api.get<ChatConfig>('/ai-chat/models', {
            showLoading: false,
        });
    },

    /**
     * Get LLM configuration status
     */
    getConfig: (): Promise<ApiResponse<{
        configuredProviders: Array<{
            id: string;
            name: string;
            hasApiKey: boolean;
        }>;
    }>> => {
        return api.get('/ai-chat/config', {
            showLoading: false,
        });
    },

    /**
     * Validate model configuration
     */
    validateModel: (modelId: string): Promise<ApiResponse<unknown>> => {
        return api.post('/ai-chat/validate-model', { modelId });
    },

    /**
     * Get provider configuration
     */
    getProviderConfig: (providerId: string): Promise<ApiResponse<{
        configured: boolean;
        baseURL?: string;
        apiKey?: string;
        error?: string;
    }>> => {
        return api.get(`/ai-chat/provider/${providerId}`, {
            showLoading: false,
        });
    },
};
