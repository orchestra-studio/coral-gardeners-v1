import { Injectable } from '@nestjs/common';
import { McpRegistryService } from '@rekog/mcp-nest';

/**
 * MCP Module Manager Service
 * Manages MCP module discovery and selection
 */
@Injectable()
export class McpModuleManagerService {
    constructor(private readonly mcpRegistry: McpRegistryService) { }

    /**
     * Get list of available MCP module IDs
     */
    getAvailableMcpModules(): string[] {
        return this.mcpRegistry.getMcpModuleIds();
    }

    /**
     * Get default MCP module ID
     */
    getDefaultMcpModuleId(): string {
        const moduleIds = this.getAvailableMcpModules();
        return moduleIds[0] || 'mcp-module-0';
    }

    /**
     * Get all tools from a specific MCP module
     */
    getToolsFromModule(mcpModuleId: string): any[] {
        return this.mcpRegistry.getTools(mcpModuleId);
    }

    /**
     * Find a specific tool in an MCP module
     */
    findTool(mcpModuleId: string, toolName: string): any {
        return this.mcpRegistry.findTool(mcpModuleId, toolName);
    }
}
