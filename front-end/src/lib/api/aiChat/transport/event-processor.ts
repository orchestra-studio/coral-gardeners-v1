import type { UIMessageChunk } from "ai";
import type { StreamHelpers } from "./stream-helpers";
import { extractDataPayload, parseArgs } from "./utils";
import { formatThinkingMessage, formatToolUseMessage } from "./formatters";

/**
 * Process a single SSE event block and emit appropriate chunks
 * 
 * @returns true if stream should stop, false to continue
 */
export const processEventBlock = (
    eventBlock: string,
    controller: ReadableStreamDefaultController<UIMessageChunk>,
    messageId: string,
    helpers: StreamHelpers,
): boolean => {
    const payload = extractDataPayload(eventBlock);

    if (!payload) {
        return false;
    }

    if (payload === "[DONE]") {
        helpers.finish();
        return true;
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(payload);
    } catch (error) {
        console.warn("Failed to parse chat stream payload", error);
        return false;
    }

    if (parsed === null) {
        return false;
    }

    if (typeof parsed !== "object") {
        if (typeof parsed === "string") {
            helpers.sendTextDelta(parsed);
        }
        return false;
    }

    const asRecord = parsed as Record<string, unknown>;

    // Handle error
    if (typeof asRecord.error === "string") {
        controller.enqueue({ type: "error", errorText: asRecord.error });
        helpers.finish();
        return true;
    }

    // Handle thinking/reasoning
    if (asRecord.type === "thinking" && typeof asRecord.content === "string") {
        helpers.startReasoning();
        helpers.appendReasoning(formatThinkingMessage());
        return false;
    }

    // Handle tool use
    if (asRecord.type === "tool_use") {
        const toolName = typeof asRecord.tool === "string" ? asRecord.tool : "tool";
        const toolCallId = typeof asRecord.tool_call_id === "string" ? asRecord.tool_call_id : undefined;
        const argsRaw = typeof asRecord.args === "string" ? asRecord.args : undefined;
        const parsedArgs = argsRaw ? parseArgs(argsRaw) : undefined;

        helpers.setToolContext({
            toolName,
            toolCallId,
            args: parsedArgs,
        });
        helpers.startReasoning();
        helpers.appendReasoning(formatToolUseMessage(toolName));
        return false;
    }

    // Handle tool result
    if (asRecord.type === "tool_result") {
        const context = helpers.consumeToolContext();
        const toolName = typeof asRecord.tool === "string" ? asRecord.tool : context?.toolName ?? "tool";
        const result = asRecord.result;
        const toolCallId = typeof asRecord.tool_call_id === "string" ? asRecord.tool_call_id : context?.toolCallId;

        helpers.emitToolResult({
            toolName,
            result,
            toolCallId,
            args: context?.args,
        });
        helpers.finishReasoning();
        return false;
    }

    // Handle chart data
    if (asRecord.type === "chart" && typeof asRecord.content === "string") {
        try {
            // Extract chart JSON from markdown format: ```chart\n{...}\n```
            const chartMarkdown = asRecord.content;
            const jsonMatch = chartMarkdown.match(/```chart\s*\n([\s\S]*?)\n```/);

            if (jsonMatch && jsonMatch[1]) {
                const chartSpec = JSON.parse(jsonMatch[1]);

                // Map backend chart format to frontend format
                const chartBlock = {
                    type: "chart" as const,
                    title: chartSpec.title,
                    description: chartSpec.description,
                    chartKind: chartSpec.kind,
                    data: chartSpec.data,
                    series: chartSpec.series,
                    xKey: chartSpec.xKey,
                    showLegend: chartSpec.showLegend ?? true,
                    showGrid: chartSpec.showGrid ?? true,
                };

                // Emit chart as data chunk
                controller.enqueue({
                    type: "data-chart",
                    id: messageId,
                    data: chartBlock,
                });
            }
        } catch (error) {
            console.warn("Failed to parse chart data", error);
        }
        return false;
    }

    // Handle regular text content
    if (typeof asRecord.content === "string" && asRecord.content.length > 0) {
        helpers.sendTextDelta(asRecord.content);
    }

    return false;
};
