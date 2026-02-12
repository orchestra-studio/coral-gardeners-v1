/**
 * Type definitions for chat transport
 */

export type BackendMessage = {
    role: string;
    content: string;
    blocks?: Array<{
        type: string;
        content: unknown;
    }>;
};

export type ToolResultChunkData = {
    toolName: string;
    result: unknown;
    toolCallId?: string;
    args?: unknown;
};

export type ToolContext = {
    toolName: string;
    toolCallId?: string;
    args?: unknown;
};
