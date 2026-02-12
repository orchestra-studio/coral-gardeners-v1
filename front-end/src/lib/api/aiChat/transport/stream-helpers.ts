import type { UIMessageChunk } from "ai";
import type { ToolResultChunkData, ToolContext } from "./types";

/**
 * Stream controller helpers for managing message chunks
 */
export interface StreamHelpers {
    ensureTextStart(): void;
    sendTextDelta(delta: string): void;
    finish(): void;
    startReasoning(): void;
    appendReasoning(delta: string): void;
    finishReasoning(): void;
    emitToolResult(data: ToolResultChunkData): void;
    setToolContext(context: ToolContext): void;
    consumeToolContext(): ToolContext | null;
}

/**
 * Create stream controller helpers
 */
export const createStreamHelpers = (
    controller: ReadableStreamDefaultController<UIMessageChunk>,
    messageId: string,
): {
    helpers: StreamHelpers;
    getState: () => {
        textStarted: boolean;
        reasoningStarted: boolean;
        finished: boolean;
    };
} => {
    let textStarted = false;
    let reasoningStarted = false;
    let finished = false;
    let pendingToolContext: ToolContext | null = null;

    const ensureTextStart = () => {
        if (!textStarted) {
            textStarted = true;
            controller.enqueue({ type: "text-start", id: messageId });
        }
    };

    const sendTextDelta = (delta: string) => {
        if (!delta) return;
        ensureTextStart();
        controller.enqueue({ type: "text-delta", id: messageId, delta });
    };

    const startReasoning = () => {
        if (!reasoningStarted) {
            reasoningStarted = true;
            controller.enqueue({ type: "reasoning-start", id: messageId });
        }
    };

    const appendReasoning = (delta: string) => {
        if (!delta) return;
        startReasoning();
        controller.enqueue({ type: "reasoning-delta", id: messageId, delta });
    };

    const finishReasoning = () => {
        if (reasoningStarted) {
            controller.enqueue({ type: "reasoning-end", id: messageId });
            reasoningStarted = false;
        }
    };

    const emitToolResult = (data: ToolResultChunkData) => {
        controller.enqueue({
            type: "data-tool-result",
            id: data.toolCallId,
            data,
        });
    };

    const setToolContext = (context: ToolContext) => {
        pendingToolContext = context;
    };

    const consumeToolContext = (): ToolContext | null => {
        const context = pendingToolContext;
        pendingToolContext = null;
        return context;
    };

    const finish = () => {
        if (finished) return;
        finished = true;
        pendingToolContext = null;

        finishReasoning();

        if (textStarted) {
            controller.enqueue({ type: "text-end", id: messageId });
        }

        controller.enqueue({ type: "finish" });
        controller.close();
    };

    return {
        helpers: {
            ensureTextStart,
            sendTextDelta,
            finish,
            startReasoning,
            appendReasoning,
            finishReasoning,
            emitToolResult,
            setToolContext,
            consumeToolContext,
        },
        getState: () => ({
            textStarted,
            reasoningStarted,
            finished,
        }),
    };
};
