import type { UIMessage } from "ai";
import type { BackendMessage } from "./types";

/**
 * Extract text content from a UI message
 */
const extractMessageText = (message: UIMessage): string => {
    const parts = Array.isArray(message.parts) ? message.parts : [];
    let text = "";

    for (const rawPart of parts as Array<Record<string, unknown>>) {
        const type = typeof rawPart.type === "string" ? rawPart.type : undefined;

        if (type === "text" && typeof rawPart.text === "string") {
            text += rawPart.text;
            continue;
        }

        if (type === "text-delta" && typeof rawPart.delta === "string") {
            text += rawPart.delta;
            continue;
        }
    }

    const messageWithFallback = message as unknown as { content?: unknown };

    if (!text && typeof messageWithFallback.content === "string") {
        text = messageWithFallback.content;
    }

    return text.trim();
};

/**
 * Convert UI messages to backend format
 * Filters to user/assistant messages only and extracts text content and blocks
 */
export const toBackendMessages = (messages: UIMessage[]): BackendMessage[] =>
    messages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map((message) => {
            const baseMessage = {
                role: message.role,
                content: extractMessageText(message),
            };

            // Include experimental_blocks if they exist
            const messageWithBlocks = message as unknown as { experimental_blocks?: Array<{ type: string; content: unknown }> };
            if (messageWithBlocks.experimental_blocks && Array.isArray(messageWithBlocks.experimental_blocks)) {
                return {
                    ...baseMessage,
                    blocks: messageWithBlocks.experimental_blocks,
                };
            }

            return baseMessage;
        })
        .filter((entry) => entry.content.length > 0);
