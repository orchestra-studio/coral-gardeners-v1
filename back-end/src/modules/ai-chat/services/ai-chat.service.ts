import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { streamText, ModelMessage, stepCountIs } from 'ai';
import { getModel } from '../providers/model-registry';
import { PromptBuilder } from './prompt-builder';
import { McpIntegrationService } from './mcp-integration.service';
import {
    ModelConfigService,
    SseHelperService,
    ToolSchemaService,
    StreamChunkHandlerService,
} from './helpers';

@Injectable()
export class AiChatService {
    private promptBuilder = new PromptBuilder();

    constructor(
        private readonly mcpIntegration: McpIntegrationService,
        private readonly modelConfig: ModelConfigService,
        private readonly sseHelper: SseHelperService,
        private readonly toolSchema: ToolSchemaService,
        private readonly streamHandler: StreamChunkHandlerService,
    ) { }

    async streamChat(
        messages: ModelMessage[],
        modelName: string,
        provider: string,
        res: Response,
        userName?: string,
    ): Promise<void> {
        try {
            const model = getModel(provider, modelName);
            const mcpModuleId = this.mcpIntegration.getDefaultMcpModuleId();
            const tools: Record<string, any> = this.mcpIntegration.convertMcpToolsToAiSdk(mcpModuleId);

            // Convert tools to array format for prompt
            const toolsArray = this.toolSchema.convertToolsToArray(tools);

            // Build system prompt with tools documentation
            const systemPrompt = this.promptBuilder.buildSystemPrompt(
                toolsArray,
                userName,
                new Date().toLocaleDateString(),
            );

            const messagesWithSystem: ModelMessage[] = [
                { role: 'system', content: systemPrompt },
                ...messages,
            ];

            // Reset stream handler state
            this.streamHandler.reset();
            let hasTextOutput = false;

            // Create streaming text result
            const result = streamText({
                model: model as any,
                messages: messagesWithSystem,
                tools,
                stopWhen: stepCountIs(5),
                onChunk: ({ chunk }) => {
                    if (chunk.type === 'reasoning-delta') {
                        this.streamHandler.handleReasoningDelta(res);
                        return;
                    }

                    if (chunk.type === 'tool-call') {
                        this.streamHandler.handleToolCall(res, chunk);
                        return;
                    }

                    if (chunk.type === 'tool-result') {
                        this.streamHandler.handleToolResult(res, chunk);
                        return;
                    }
                },
            });

            // Initialize SSE headers
            this.sseHelper.initializeSseHeaders(res);

            // Stream text chunks to client
            for await (const chunk of result.textStream) {
                if (!hasTextOutput && typeof chunk === 'string' && chunk.trim().length > 0) {
                    hasTextOutput = true;
                }

                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
                if (typeof (res as any).flush === 'function') {
                    (res as any).flush();
                }
            }

            // Send fallback text if no text output was generated
            if (!hasTextOutput) {
                const fallbackText = this.streamHandler.getFallbackText();
                if (fallbackText) {
                    res.write(`data: ${JSON.stringify({ content: fallbackText })}\n\n`);
                    if (typeof (res as any).flush === 'function') {
                        (res as any).flush();
                    }
                }
            }

            // End stream
            this.sseHelper.endSseStream(res);
        } catch (error) {
            console.error('Stream error:', error);
            this.sseHelper.sendSseError(res, error);
        }
    }

    getAvailableModels() {
        return this.modelConfig.getAvailableModels();
    }
}
