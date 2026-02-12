import { Injectable } from '@nestjs/common';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Tool Schema Service
 * Handles conversion and formatting of tool schemas
 */
@Injectable()
export class ToolSchemaService {
    /**
     * Convert tool schema to JSON schema format for prompts
     */
    getToolSchemaForPrompt(tool: any): any {
        const schema = tool?.inputSchema;
        if (!schema) {
            return {};
        }

        try {
            if (typeof schema.safeParse === 'function') {
                return zodToJsonSchema(schema, { $refStrategy: 'none' });
            }

            return schema;
        } catch (error) {
            console.warn('[ToolSchema] Failed to convert tool schema for prompt:', error);
            return {};
        }
    }

    /**
     * Convert MCP tools to array format with schema information
     */
    convertToolsToArray(tools: Record<string, any>): Array<{
        name: string;
        description: string;
        parameters: any;
    }> {
        return Object.entries(tools).map(([name, tool]) => ({
            name,
            description: tool.description || '',
            parameters: this.getToolSchemaForPrompt(tool),
        }));
    }
}
