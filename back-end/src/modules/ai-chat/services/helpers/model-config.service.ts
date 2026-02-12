import { Injectable } from '@nestjs/common';

/**
 * Model Configuration Service
 * Manages available AI models and their configurations
 */
@Injectable()
export class ModelConfigService {
    /**
     * Get list of available AI models with their specifications
     */
    getAvailableModels() {
        return {
            models: [
                {
                    id: 'gemini-3-flash-preview',
                    name: 'Gemini 3 Flash',
                    provider: 'google',
                    contextWindow: 1000000,
                    maxTokens: 8192,
                    description: 'Gemini 3 Flash - Best for agentic use cases, tool calling, and function execution with thinking capabilities - ideal for MCP integration',
                },
                {
                    id: 'deepseek-chat',
                    name: 'DeepSeek Chat',
                    provider: 'deepseek',
                    contextWindow: 64000,
                    maxTokens: 4096,
                    description: 'DeepSeek conversational model',
                },
            ],
        };
    }
}
