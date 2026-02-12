import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
    Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { I18nService } from '../../i18n/i18n.service';

@Controller('tasks')
@UseGuards(AuthGuard('bearer'))
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private readonly i18n: I18nService,
    ) { }

    /**
     * GET /api/tasks
     * Get all tasks for the authenticated admin with pagination
     * Query params:
     * - page: page number (default: 1)
     * - page_count: items per page (default: 10)
     * - status: filter by status ('active' | 'completed' | 'all') (default: 'all')
     */
    @Get()
    async findAll(@Request() req: any, @Query() query: any) {
        const adminId = req.user.id;
        const page = query.page ? parseInt(query.page, 10) : 1;
        const perPage = query.page_count ? parseInt(query.page_count, 10) : 10;
        const status = query.status || 'all';

        const result = await this.tasksService.findAll(adminId, page, perPage, status);

        return {
            success: true,
            data: result.data,
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            message: '',
        };
    }

    /**
     * GET /api/tasks/history
     * Get tasks with history (active and completed)
     */
    @Get('history')
    async findAllWithHistory(@Request() req: any) {
        const adminId = req.user.id;

        const history = await this.tasksService.findAllWithHistory(adminId);

        return {
            success: true,
            data: history,
            message: '',
        };
    }

    /**
     * GET /api/tasks/stats
     * Get task statistics
     */
    @Get('stats')
    async getStats(@Request() req: any) {
        const adminId = req.user.id;

        const stats = await this.tasksService.getStats(adminId);

        return {
            success: true,
            data: stats,
            message: '',
        };
    }

    /**
     * GET /api/tasks/:id
     * Get a specific task
     */
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Request() req: any,
        @Headers('accept-language') locale: string,
    ) {
        const adminId = req.user.id;

        const task = await this.tasksService.findOne(+id, adminId, locale);

        return {
            success: true,
            data: task,
            message: '',
        };
    }

    /**
     * POST /api/tasks
     * Create a new task
     */
    @Post()
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @Request() req: any,
        @Headers('accept-language') locale: string,
    ) {
        const adminId = req.user.id;

        const task = await this.tasksService.create(createTaskDto, adminId);

        return {
            success: true,
            data: task,
            message: this.i18n.t('created', 'tasks', locale),
        };
    }

    /**
     * PATCH /api/tasks/:id
     * Update a task
     */
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req: any,
        @Headers('accept-language') locale: string,
    ) {
        const adminId = req.user.id;

        const task = await this.tasksService.update(+id, updateTaskDto, adminId, locale);

        return {
            success: true,
            data: task,
            message: this.i18n.t('updated', 'tasks', locale),
        };
    }

    /**
     * PATCH /api/tasks/:id/toggle
     * Toggle task completion status
     */
    @Patch(':id/toggle')
    async toggleComplete(
        @Param('id') id: string,
        @Request() req: any,
        @Headers('accept-language') locale: string,
    ) {
        const adminId = req.user.id;

        const task = await this.tasksService.toggleComplete(+id, adminId, locale);

        return {
            success: true,
            data: task,
            message: this.i18n.t('status_toggled', 'tasks', locale),
        };
    }

    /**
     * DELETE /api/tasks/:id
     * Delete a task
     */
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Request() req: any,
        @Headers('accept-language') locale: string,
    ) {
        const adminId = req.user.id;

        await this.tasksService.remove(+id, adminId, locale);

        return {
            success: true,
            data: null,
            message: this.i18n.t('deleted', 'tasks', locale),
        };
    }
}
