/**
 * AI Chat Service - Main exports
 */

// Re-export types from lib/api
export type {
    ChatSession,
    ChatSessionWithMessages,
    ChatConfig,
    LLMModel,
    LLMProvider,
    ChatMessage,
    StreamChatParams,
} from '@/lib/api';

// Re-export API functions
export { chatSessionsApi } from '@/lib/api';

// Cache Keys
export { aiChatKeys } from './keys/aiChatKeys';

// Hooks
export * from './hooks';
