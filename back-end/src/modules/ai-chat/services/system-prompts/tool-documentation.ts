import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Tool Documentation Builder
 * Generates documentation for available MCP tools
 */

/**
 * Get a summary of tool parameters
 */
export function getParametersSummary(parameters: any): string {
    if (!parameters) {
        return '';
    }

    try {
        if (typeof parameters.safeParse === 'function') {
            const schema = zodToJsonSchema(parameters, { $refStrategy: 'none' }) as any;
            return stringifyProperties(schema?.properties);
        }

        if (parameters.properties) {
            return stringifyProperties(parameters.properties);
        }
    } catch (error) {
        console.warn('[ToolDocumentation] Failed to build tool documentation:', error);
    }

    return '';
}

/**
 * Convert properties object to a readable string
 */
function stringifyProperties(properties: Record<string, any> | undefined): string {
    if (!properties) {
        return '';
    }

    return Object.entries(properties)
        .map(([key, value]) => {
            const type = Array.isArray(value.type) ? value.type.filter(Boolean).join(' | ') : value.type;
            return `${key}: ${value.description || type || 'unspecified'}`;
        })
        .join(', ');
}

/**
 * Build a formatted list of all available tools
 */
export function buildToolsList(tools: any[]): string {
    return tools
        .map((tool) => {
            const paramsSummary = getParametersSummary(tool.parameters);

            return `- **${tool.name}**: ${tool.description || 'No description provided.'}${paramsSummary ? `\n  • Parameters: ${paramsSummary}` : ''}`;
        })
        .join('\n');
}
