import type { UIMessage } from "ai";
import type { ChatMessage, ReasoningMessage, ToolMessageBlock } from "@/types/ai-chat";
import { isTextPart, isReasoningPart } from "./message-types";
import { aggregateTextParts } from "./message-aggregator";
import { extractChartBlocks } from "./chart-parser";

export const processMessages = (
    uiMessages: UIMessage[],
    getTimestamp: (id: string) => Date
): {
    history: ChatMessage[];
    streamingEntry: ChatMessage | null;
    streamingId: string | null;
    reasoning: ReasoningMessage | null;
} => {
    const history: ChatMessage[] = [];
    let streamingEntry: ChatMessage | null = null;
    let streamingId: string | null = null;
    let activeReasoning: ReasoningMessage | null = null;

    uiMessages.forEach((message, index) => {
        if (message.role === "system") {
            return;
        }

        const parts = (message.parts ?? []) as Array<{ type: string;[key: string]: unknown }>;
        const textParts = parts.filter(isTextPart);
        const reasoningText = parts
            .filter(isReasoningPart)
            .map((part) => part.text ?? "")
            .join("")
            .trim();

        // Extract chart blocks from data-chart parts
        const chartParts = parts.filter((part) => part.type === "data-chart");
        const chartBlocks: ToolMessageBlock[] = chartParts
            .map((part) => part.data)
            .filter((data): data is ToolMessageBlock => data != null && typeof data === "object" && "type" in data && data.type === "chart");

        const isLastMessage = index === uiMessages.length - 1;

        // Update or clear reasoning
        // Key insight: When Gemini uses multiple tools in one response,
        // we only want to show the CURRENT tool being executed, not accumulated reasoning
        if (reasoningText) {
            const reasoningId = `${message.id}-reasoning`;

            // Always replace with new reasoning to ensure only current tool shows
            activeReasoning = {
                id: reasoningId,
                content: reasoningText,
                timestamp: getTimestamp(reasoningId),
            };
        } else if (!isLastMessage || message.role === "user") {
            // Clear reasoning if this is not the last message or it's a user message
            activeReasoning = null;
        }

        if (message.role === "user") {
            const { content: userRaw } = aggregateTextParts(textParts);
            const textContent = userRaw.trim();
            if (!textContent) {
                return;
            }
            history.push({
                id: message.id,
                role: "user",
                content: textContent,
                timestamp: getTimestamp(message.id),
                variant: "default",
            });
            return;
        }

        if (message.role !== "assistant") {
            return;
        }

        const { content: textContentRaw, isStreaming } = aggregateTextParts(textParts);
        let cleanedContent = textContentRaw;
        const blocks: ToolMessageBlock[] = [];

        // Add chart blocks from data-chart parts
        blocks.push(...chartBlocks);

        if (isStreaming && typeof cleanedContent === "string") {
            // Hide everything from [CHART_START] or ```chart onwards
            let cutoffIndex = cleanedContent.indexOf("[CHART_START]");
            if (cutoffIndex === -1) {
                cutoffIndex = cleanedContent.indexOf("```chart");
            }

            if (cutoffIndex !== -1) {
                cleanedContent = cleanedContent.slice(0, cutoffIndex).trim();
            }

            // Also strip any stray markers that might appear
            cleanedContent = cleanedContent
                .replace(/\[CHART_START\]/gi, "")
                .replace(/\[CHART_END\]/gi, "")
                .replace(/\[blocked\]/gi, "")
                .replace(/\(streamdown:incomplete-link\)/gi, "")
                .trim();
        }

        if (!isStreaming) {
            const parsed = extractChartBlocks(textContentRaw);
            cleanedContent = parsed.cleanedText;
            // Merge parsed blocks with chart blocks (don't overwrite!)
            blocks.push(...parsed.blocks);
        }

        const sanitizedContent = cleanedContent.trim();

        if (!sanitizedContent && blocks.length === 0) {
            if (isStreaming) {
                streamingEntry = null;
                streamingId = message.id;
            }
            return;
        }

        const assistantMessage: ChatMessage = {
            id: message.id,
            role: "assistant",
            content: sanitizedContent,
            timestamp: getTimestamp(message.id),
            variant: blocks.length > 0 ? "tool" : "default",
            blocks: blocks.length > 0 ? blocks : undefined,
        };

        if (isStreaming) {
            streamingEntry = assistantMessage;
            streamingId = message.id;
        } else {
            streamingEntry = null;
            streamingId = null;
            history.push(assistantMessage);
        }
    });

    return {
        history,
        streamingEntry,
        streamingId,
        reasoning: activeReasoning,
    };
};
