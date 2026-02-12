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
 */
export function getModel(provider: string, modelName: string): LanguageModel {
    const apiKey = getProviderApiKey(provider);

    switch (provider) {
        case 'openai':
            if (apiKey) {
                const customOpenai = createOpenAI({ apiKey });
                return customOpenai(modelName);
            }
            return openai(modelName);

        case 'google':
            if (apiKey) {
                const customGoogle = createGoogleGenerativeAI({ apiKey });
                return customGoogle(modelName);
            }
            return google(modelName);

        case 'anthropic':
            if (apiKey) {
                const customAnthropic = createAnthropic({ apiKey });
                return customAnthropic(modelName);
            }
            return anthropic(modelName);

        case 'deepseek':
            // DeepSeek uses OpenAI-compatible chat completions endpoint
            const deepseek = createOpenAI({
                apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
                baseURL: 'https://api.deepseek.com/v1',
            });
            return deepseek.chat(modelName);

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
