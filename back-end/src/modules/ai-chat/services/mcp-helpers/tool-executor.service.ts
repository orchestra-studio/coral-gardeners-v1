import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

/**
 * Tool Executor Service
 * Handles execution of MCP tool methods
 */
@Injectable()
export class ToolExecutorService {
    constructor(private readonly moduleRef: ModuleRef) { }

    /**
     * Execute a tool method with validated arguments
     */
    async execute(
        tool: any,
        validatedArgs: any,
    ): Promise<any> {
        try {
            // Resolve the tool instance from NestJS DI container
            const toolInstance = await this.moduleRef.resolve(
                tool.providerClass,
                undefined,
                { strict: false },
            );

            // Verify tool instance and method exist
            if (!toolInstance || typeof toolInstance[tool.methodName] !== 'function') {
                return {
                    success: false,
                    error: `Handler for tool '${tool.metadata.name}' not available`,
                };
            }

            // Execute the tool method
            const result = await toolInstance[tool.methodName].call(
                toolInstance,
                validatedArgs,
            );

            // Return result or error if no result returned
            return result ?? {
                success: false,
                error: 'Tool executed without returning a result',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Tool execution failed',
            };
        }
    }
}
