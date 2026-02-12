import { Injectable } from '@nestjs/common';
import {
    McpModuleManagerService,
    ToolConverterService,
} from './mcp-helpers';

/**
 * MCP Integration Service
 * Simplified service that delegates to specialized helper services
 */
@Injectable()
export class McpIntegrationService {
    constructor(
        private readonly moduleManager: McpModuleManagerService,
        private readonly toolConverter: ToolConverterService,
    ) { }

    /**
     * Convert MCP tools to Vercel AI SDK format
     */
    convertMcpToolsToAiSdk(mcpModuleId: string): Record<string, any> {
        return this.toolConverter.convertMcpToolsToAiSdk(mcpModuleId);
    }

    /**
     * Get available MCP modules
     */
    getAvailableMcpModules(): string[] {
        return this.moduleManager.getAvailableMcpModules();
    }

    /**
     * Get default MCP module ID
     */
    getDefaultMcpModuleId(): string {
        return this.moduleManager.getDefaultMcpModuleId();
    }
}
