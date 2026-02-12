import { Injectable } from '@nestjs/common';
import { tool } from 'ai';
import { McpModuleManagerService } from './mcp-module-manager.service';
import { ToolArgumentValidatorService } from './tool-argument-validator.service';
import { ToolExecutorService } from './tool-executor.service';

/**
 * Tool Converter Service
 * Converts MCP tools to Vercel AI SDK format
 */
@Injectable()
export class ToolConverterService {
    constructor(
        private readonly mcpModuleManager: McpModuleManagerService,
        private readonly argumentValidator: ToolArgumentValidatorService,
        private readonly toolExecutor: ToolExecutorService,
    ) { }

    /**
     * Convert MCP tools to Vercel AI SDK format
     */
    convertMcpToolsToAiSdk(mcpModuleId: string): Record<string, any> {
        const mcpTools = this.mcpModuleManager.getToolsFromModule(mcpModuleId);
        const aiSdkTools: Record<string, any> = {};

        for (const mcpTool of mcpTools) {
            // Use Vercel AI SDK tool() helper for proper type inference
            aiSdkTools[mcpTool.metadata.name] = tool({
                description: mcpTool.metadata.description || '',
                inputSchema: mcpTool.metadata.parameters as any,
                execute: async (args: any) => {
                    const result = await this.executeToolCall(mcpTool.metadata.name, args, mcpModuleId);

                    // Store full result for frontend, return summary for LLM
                    if (mcpTool.metadata.name === 'display-chart-to-user' && result?.chartMarkdown) {
                        // Create llmSummary with full chart data attached
                        const llmResponse = result.llmSummary || {
                            success: true,
                            message: 'Chart displayed successfully',
                        };

                        // Attach full chart data for the stream handler
                        llmResponse.__fullChartData = {
                            chartMarkdown: result.chartMarkdown,
                            chart: result.chart,
                        };

                        // Return only the summary with chart data attached
                        return llmResponse;
                    }

                    return result;
                },
            } as any);
        }

        return aiSdkTools;
    }

    /**
     * Execute a tool call with validation and error handling
     */
    private async executeToolCall(
        toolName: string,
        args: any,
        mcpModuleId: string,
    ): Promise<any> {
        try {
            // Find the tool in registry
            const tool = this.mcpModuleManager.findTool(mcpModuleId, toolName);

            if (!tool) {
                return {
                    success: false,
                    error: `Tool '${toolName}' not found`,
                };
            }

            // Validate arguments
            const validation = this.argumentValidator.validateArguments(
                args,
                tool.metadata.parameters,
            );

            if (!validation.success) {
                return {
                    success: false,
                    error: validation.error,
                };
            }

            // Execute tool
            return await this.toolExecutor.execute(tool, validation.data);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Tool execution failed',
            };
        }
    }
}
