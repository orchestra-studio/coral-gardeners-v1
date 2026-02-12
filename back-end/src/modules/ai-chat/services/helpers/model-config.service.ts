import { Injectable } from '@nestjs/common';

interface ModelConfig {
    id: string;
    name: string;
    provider: string;
    contextWindow: number;
    maxTokens: number;
    description: string;
    envKey: string;
}

const ALL_MODELS: ModelConfig[] = [
    {
        id: 'gemini-3-flash-preview',
        name: 'Gemini 3 Flash',
        provider: 'google',
        contextWindow: 1000000,
        maxTokens: 8192,
        description: 'Gemini 3 Flash - Best for agentic use cases, tool calling, and function execution with thinking capabilities',
        envKey: 'GOOGLE_API_KEY',
    },
    {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        contextWindow: 64000,
        maxTokens: 4096,
        description: 'DeepSeek conversational model',
        envKey: 'DEEPSEEK_API_KEY',
    },
    {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        contextWindow: 128000,
        maxTokens: 4096,
        description: 'OpenAI GPT-4 Turbo - Most capable OpenAI model',
        envKey: 'OPENAI_API_KEY',
    },
    {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        contextWindow: 200000,
        maxTokens: 8192,
        description: 'Anthropic Claude 3.5 Sonnet - Balanced performance and speed',
        envKey: 'ANTHROPIC_API_KEY',
    },
];

/**
 * Model Configuration Service
 * Only returns models whose API key is configured in the environment
 */
@Injectable()
export class ModelConfigService {
    getAvailableModels() {
        const models = ALL_MODELS.filter(model => {
            const key = process.env[model.envKey];
            return key && key.trim().length > 0;
        }).map(({ envKey, ...model }) => model);

        return { models };
    }
}
