import { Module } from '@nestjs/common';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './services/ai-chat.service';
import { McpIntegrationService } from './services/mcp-integration.service';
import {
    ModelConfigService,
    SseHelperService,
    ToolSchemaService,
    ResponseFormatterService,
    StreamChunkHandlerService,
} from './services/helpers';
import {
    McpModuleManagerService,
    ToolArgumentValidatorService,
    ToolExecutorService,
    ToolConverterService,
} from './services/mcp-helpers';
import { McpModule } from '../mcp/mcp.module';
import { AdminModule } from '../admins/admin.module';

@Module({
    imports: [McpModule, AdminModule],
    controllers: [AiChatController],
    providers: [
        AiChatService,
        McpIntegrationService,
        // AI Chat Helper Services
        ModelConfigService,
        SseHelperService,
        ToolSchemaService,
        ResponseFormatterService,
        StreamChunkHandlerService,
        // MCP Helper Services
        McpModuleManagerService,
        ToolArgumentValidatorService,
        ToolExecutorService,
        ToolConverterService,
    ],
    exports: [AiChatService],
})
export class AiChatModule { }
