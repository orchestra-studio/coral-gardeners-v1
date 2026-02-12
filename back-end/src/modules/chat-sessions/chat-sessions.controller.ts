import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatSessionsService } from './chat-sessions.service';
import {
    CreateSessionDto,
    UpdateSessionDto,
    SaveMessagesDto,
    ListSessionsDto,
    ListMessagesDto,
} from './dto';

@Controller('chat-sessions')
@UseGuards(AuthGuard('bearer'))
export class ChatSessionsController {
    constructor(private readonly chatSessionsService: ChatSessionsService) { }

    @Get()
    async findAll(@Query() query: ListSessionsDto, @Req() req: any) {
        const adminId = req.user?.id;
        const result = await this.chatSessionsService.findAll(adminId, query);
        return {
            success: true,
            data: result,
            message: 'Sessions retrieved successfully',
        };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const adminId = req.user?.id;
        const session = await this.chatSessionsService.findOne(id, adminId);
        return {
            success: true,
            data: session,
            message: 'Session retrieved successfully',
        };
    }

    @Get(':id/messages')
    async getMessages(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: ListMessagesDto,
        @Req() req: any,
    ) {
        const adminId = req.user?.id;
        const result = await this.chatSessionsService.getMessages(id, query, adminId);
        return {
            success: true,
            data: result, // Return the full pagination object
            message: 'Messages retrieved successfully',
        };
    }

    @Post()
    async create(@Body() dto: CreateSessionDto, @Req() req: any) {
        const adminId = req.user?.id;
        const session = await this.chatSessionsService.create(dto, adminId);
        return {
            success: true,
            data: session,
            message: 'Session created successfully',
        };
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSessionDto,
        @Req() req: any,
    ) {
        const adminId = req.user?.id;
        const session = await this.chatSessionsService.update(id, dto, adminId);
        return {
            success: true,
            data: session,
            message: 'Session updated successfully',
        };
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const adminId = req.user?.id;
        await this.chatSessionsService.delete(id, adminId);
        return {
            success: true,
            data: null,
            message: 'Session deleted successfully',
        };
    }

    @Post(':id/messages')
    async saveMessages(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: SaveMessagesDto,
        @Req() req: any,
    ) {
        const adminId = req.user?.id;
        await this.chatSessionsService.saveMessages(id, dto, adminId);
        return {
            success: true,
            data: null,
            message: 'Messages saved successfully',
        };
    }
}
