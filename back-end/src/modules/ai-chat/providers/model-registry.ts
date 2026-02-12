import { openai, createOpenAI } from '@ai-sdk/openai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { anthropic, createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';

/**
 * Model Registry
 * Centralized registry for all AI models using Vercel AI SDK
 */

export interface ModelProvider {
    id: string;
    name: string;
    models: string[];
}

export const MODEL_PROVIDERS: ModelProvider[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
    },
    {
        id: 'google',
        name: 'Google Gemini',
        models: ['gemini-3-flash-preview'],
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        models: ['deepseek-chat'],
    },
];

/**
 * Get AI SDK model instance by provider and model name
 * Throws a clear error if the API key is not configured
 */
export function getModel(provider: string, modelName: string): LanguageModel {
    const apiKey = getProviderApiKey(provider);

    if (!apiKey) {
        throw new Error(
            `API key not configured for provider "${provider}". ` +
            `Set the ${provider.toUpperCase()}_API_KEY environment variable.`
        );
    }

    switch (provider) {
        case 'openai': {
            const customOpenai = createOpenAI({ apiKey });
            return customOpenai(modelName);
        }

        case 'google': {
            const customGoogle = createGoogleGenerativeAI({ apiKey });
            return customGoogle(modelName);
        }

        case 'anthropic': {
            const customAnthropic = createAnthropic({ apiKey });
            return customAnthropic(modelName);
        }

        case 'deepseek': {
            const deepseek = createOpenAI({
                apiKey,
                baseURL: 'https://api.deepseek.com/v1',
            });
            return deepseek.chat(modelName);
        }

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

/**
 * Get API key from environment for a provider
 */
export function getProviderApiKey(provider: string): string | undefined {
    const envKey = `${provider.toUpperCase()}_API_KEY`;
    return process.env[envKey];
}
