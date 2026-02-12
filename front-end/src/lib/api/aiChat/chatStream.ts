import type { UIMessage } from "ai";
import { apiClient } from "../client";
import { NestChatTransport, toBackendMessages } from "./nest-chat-transport";
import { getAuthData } from "@/lib/auth/utils";

/**
 * Build the full streaming endpoint URL using the configured API base URL.
 */
export const getChatStreamUrl = (): string => {
    const baseUrl = apiClient.defaults.baseURL ?? "";
    if (!baseUrl) {
        return "/ai-chat/stream";
    }
    return `${baseUrl.replace(/\/$/, "")}/ai-chat/stream`;
};

/**
 * Create a NestJS chat transport configured for the AI assistant.
 */
export const createChatTransport = () => {
    const api = getChatStreamUrl();

    return new NestChatTransport({
        api,
        prepareSendMessagesRequest: async ({ body, headers, messages }) => {
            const authData = getAuthData();
            const token = authData?.token ?? null;
            const uiMessages = Array.isArray(messages) ? (messages as UIMessage[]) : [];
            const model = typeof body?.model === "string" ? (body.model as string) : undefined;
            const provider = typeof body?.provider === "string" ? (body.provider as string) : undefined;

            if (!model || !provider) {
                throw new Error("Model and provider are required.");
            }

            const normalizedHeaders: Record<string, string> =
                headers instanceof Headers
                    ? Object.fromEntries(headers.entries())
                    : Object.entries(headers ?? {}).reduce<Record<string, string>>((acc, [key, value]) => {
                        if (typeof value === "string") {
                            acc[key] = value;
                        }
                        return acc;
                    }, {});

            if (token) {
                normalizedHeaders.Authorization = `Bearer ${token}`;
            }

            const backendMessages = toBackendMessages(uiMessages);

            return {
                body: {
                    messages: backendMessages,
                    model,
                    provider,
                },
                headers: normalizedHeaders,
            };
        },
    });
};
