import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SseHelperService } from './sse-helper.service';
import { ResponseFormatterService } from './response-formatter.service';

/**
 * Stream Chunk Handler Service
 * Processes and handles different types of stream chunks
 */
@Injectable()
export class StreamChunkHandlerService {
    constructor(
        private readonly sseHelper: SseHelperService,
        private readonly responseFormatter: ResponseFormatterService,
    ) { }

    /**
     * Track thinking state
     */
    private hasSentThinkingEvent = false;

    /**
     * Track fallback text
     */
    private fallbackAssistantText: string | null = null;

    /**
     * Track tool execution count for numbering
     */
    private toolExecutionCount = 0;

    /**
     * Reset handler state for new stream
     */
    reset(): void {
        this.hasSentThinkingEvent = false;
        this.fallbackAssistantText = null;
        this.toolExecutionCount = 0;
    }

    /**
     * Handle reasoning delta chunk
     */
    handleReasoningDelta(res: Response): void {
        if (!this.hasSentThinkingEvent) {
            this.hasSentThinkingEvent = true;
            // Increment tool count and show step number for second tool onwards
            this.toolExecutionCount++;
            const message = this.toolExecutionCount === 1
                ? 'Working on it…'
                : `Step ${this.toolExecutionCount}: Working on it…`;
            this.sseHelper.writeSse(res, { type: 'thinking', content: message });
        }
    }

    /**
     * Handle tool call chunk
     */
    handleToolCall(res: Response, chunk: any): void {
        // Reset thinking state for new tool call to keep UI clean
        // This ensures only the current tool execution shows thinking badge
        this.hasSentThinkingEvent = false;

        this.sseHelper.writeSse(res, {
            type: 'tool_use',
            tool: chunk.toolName,
            tool_call_id: chunk.toolCallId,
            args: typeof chunk.input === 'string' ? chunk.input : JSON.stringify(chunk.input ?? {}),
        });
    }

    /**
     * Handle tool result chunk
     */
    handleToolResult(res: Response, chunk: any): void {
        const toolOutput = chunk.output;

        // Check if this is a chart display tool with full data attached
        const fullChartData = (toolOutput as any)?.__fullChartData;

        if (chunk.toolName === 'display-chart-to-user' && fullChartData?.chartMarkdown) {
            // Send chart to frontend
            this.sseHelper.writeSse(res, {
                type: 'chart',
                content: fullChartData.chartMarkdown,
            });
        }

        // Send tool result (summary for chart, full data for others)
        this.sseHelper.writeSse(res, {
            type: 'tool_result',
            tool: chunk.toolName,
            tool_call_id: chunk.toolCallId,
            result: toolOutput,
        });

        // Store fallback text if not already set
        if (!this.fallbackAssistantText) {
            this.fallbackAssistantText = this.responseFormatter.buildFallbackAssistantText(
                chunk.toolName,
                toolOutput,
            );
        }
    }

    /**
     * Get stored fallback text
     */
    getFallbackText(): string | null {
        return this.fallbackAssistantText;
    }
}
