import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Headers,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { I18nService } from '../../i18n/i18n.service';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('projects')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly i18n: I18nService,
    ) { }

    /**
     * GET /api/projects
     * Get all projects with pagination
     */
    @Get()
    @Permissions('projects.view')
    async findAll(
        @Query('page') page?: string,
        @Query('page_count') pageCount?: string,
        @Query('name') name?: string,
        @Query('status') status?: string,
        @Query('environment') environment?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const perPage = pageCount ? parseInt(pageCount, 10) : 10;

        const filters = { name, status, environment };
        const result = await this.projectsService.findAll(pageNum, perPage, filters);

        return {
            success: true,
            data: result,
            message: '',
        };
    }

    /**
     * GET /api/projects/statistic
     * Get projects statistics
     */
    @Get('statistic')
    @Permissions('projects.view')
    async getStatistics() {
        const stats = await this.projectsService.getStatistics();

        return {
            success: true,
            data: stats,
            message: '',
        };
    }

    /**
     * GET /api/projects/deleted
     * Get all deleted projects with pagination
     */
    @Get('deleted')
    @Permissions('projects.view')
    async findDeleted(
        @Query('page') page?: string,
        @Query('page_count') pageCount?: string,
        @Query('name') name?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const perPage = pageCount ? parseInt(pageCount, 10) : 10;

        const filters = { name };
        const result = await this.projectsService.findDeleted(pageNum, perPage, filters);

        return {
            success: true,
            data: result,
            message: '',
        };
    }

    /**
     * GET /api/projects/recent
     * Get recent projects for dashboard
     * IMPORTANT: Must come BEFORE /:id route
     */
    @Get('recent')
    @Permissions('projects.view')
    async getRecent(
        @Query('limit') limit?: string,
    ) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        const projects = await this.projectsService.getRecent(limitNum);

        return {
            success: true,
            data: projects,
            message: '',
        };
    }

    /**
     * GET /api/projects/:id
     * Get one project by ID
     */
    @Get(':id')
    @Permissions('projects.view')
    async findOne(
        @Param('id') id: string,
    ) {
        const project = await this.projectsService.findOne(Number(id));

        return {
            success: true,
            data: project,
            message: '',
        };
    }

    /**
     * POST /api/projects
     * Create a new project
     */
    @Post()
    @Permissions('projects.create')
    async create(
        @Body() createProjectDto: CreateProjectDto,
        @Headers('accept-language') locale?: string,
        @Req() req?: any,
    ) {
        const adminId = req?.user?.id;
        const project = await this.projectsService.create(createProjectDto, adminId);

        return {
            success: true,
            data: project,
            message: this.i18n.t('created', 'project', locale || 'en'),
        };
    }

    /**
     * PATCH /api/projects/:id
     * Update project by ID
     */
    @Patch(':id')
    @Permissions('projects.edit')
    async update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @Headers('accept-language') locale?: string,
    ) {
        const project = await this.projectsService.update(Number(id), updateProjectDto);

        return {
            success: true,
            data: project,
            message: this.i18n.t('updated', 'project', locale || 'en'),
        };
    }

    /**
     * DELETE /api/projects/:id
     * Delete project by ID
     */
    @Delete(':id')
    @Permissions('projects.delete')
    async remove(
        @Param('id') id: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.projectsService.remove(Number(id));

        return {
            success: true,
            data: null,
            message: this.i18n.t('deleted', 'project', locale || 'en'),
        };
    }

    /**
     * POST /api/projects/deleted/:id/restore
     * Restore a soft-deleted project
     */
    @Post('deleted/:id/restore')
    @Permissions('projects.restore')
    async restore(
        @Param('id') id: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.projectsService.restore(Number(id));

        return {
            success: true,
            data: null,
            message: this.i18n.t('restored', 'project', locale || 'en'),
        };
    }
}
