import { Injectable } from '@nestjs/common';

/**
 * Response Formatter Service
 * Builds fallback and formatted responses from tool outputs
 */
@Injectable()
export class ResponseFormatterService {
    /**
     * Build fallback assistant text from tool output
     */
    buildFallbackAssistantText(toolName: string, toolOutput: unknown): string | null {
        if (!toolOutput) {
            return `Completed ${toolName} tool.`;
        }

        if (typeof toolOutput === 'string') {
            return toolOutput;
        }

        if (typeof toolOutput !== 'object') {
            return null;
        }

        const outputRecord = toolOutput as Record<string, any>;
        const chartTitle = outputRecord?.chart?.title;
        const chartDescription = outputRecord?.chart?.description;
        const description = outputRecord?.description;
        const message = outputRecord?.message;

        if (chartDescription) {
            return chartDescription;
        }

        if (chartTitle) {
            return `Displayed chart: ${chartTitle}.`;
        }

        if (description) {
            return description;
        }

        if (message) {
            return message;
        }

        if (outputRecord.success === false && outputRecord.error) {
            return outputRecord.error;
        }

        return `Completed ${toolName} tool.`;
    }
}
