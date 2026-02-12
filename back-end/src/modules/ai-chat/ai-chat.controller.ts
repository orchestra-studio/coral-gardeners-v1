import { Controller, Post, Get, Body, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AiChatService } from './services/ai-chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('ai-chat')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class AiChatController {
    constructor(
        private readonly aiChatService: AiChatService,
    ) { }

    @Post('stream')
    @Permissions('ai_chat.use')
    async streamChat(@Body() dto: SendMessageDto, @Res() res: Response, @Request() req: any) {
        const { messages, model, provider } = dto;
        const coreMessages = messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
        }));
        const userName = req.user?.name || req.user?.email;
        return this.aiChatService.streamChat(coreMessages, model, provider, res, userName);
    }

    @Get('models')
    @Permissions('ai_chat.view_models')
    async getModels() {
        return this.aiChatService.getAvailableModels();
    }
}
