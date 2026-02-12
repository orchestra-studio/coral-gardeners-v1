import { HttpChatTransport, type UIMessage, type UIMessageChunk } from "ai";
import { getRandomId } from "./utils";
import { createStreamHelpers } from "./stream-helpers";
import { processEventBlock } from "./event-processor";

/**
 * NestJS chat transport implementation
 * Handles streaming SSE responses from NestJS backend
 */
export class NestChatTransport extends HttpChatTransport<UIMessage> {
    /**
     * Process the response stream from the backend
     * Converts SSE events into UI message chunks
     */
    processResponseStream(stream: ReadableStream<Uint8Array>): ReadableStream<UIMessageChunk> {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const messageId = getRandomId();

        return new ReadableStream<UIMessageChunk>({
            start: async (controller) => {
                let buffer = "";
                const { helpers, getState } = createStreamHelpers(controller, messageId);

                controller.enqueue({ type: "start", messageId });

                try {
                    // Read stream chunks
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        if (value) {
                            buffer += decoder.decode(value, { stream: true });
                        }

                        // Split by SSE event boundaries
                        const events = buffer.split("\n\n");
                        buffer = events.pop() ?? "";

                        // Process each event
                        for (const eventBlock of events) {
                            const shouldStop = processEventBlock(
                                eventBlock,
                                controller,
                                messageId,
                                helpers
                            );

                            if (shouldStop) {
                                return;
                            }
                        }
                    }

                    // Process any remaining buffered data
                    buffer += decoder.decode();

                    if (buffer.trim().length > 0) {
                        const shouldStopAfterBuffer = processEventBlock(
                            buffer,
                            controller,
                            messageId,
                            helpers
                        );

                        if (shouldStopAfterBuffer) {
                            return;
                        }
                    }

                    helpers.finish();
                } catch (error) {
                    const state = getState();

                    if (!state.finished) {
                        if (state.reasoningStarted) {
                            helpers.finishReasoning();
                        }
                        if (state.textStarted) {
                            controller.enqueue({ type: "text-end", id: messageId });
                        }
                    }

                    controller.error(
                        error instanceof Error ? error : new Error("Chat stream error")
                    );
                } finally {
                    reader.releaseLock();
                }
            },
        });
    }
}
