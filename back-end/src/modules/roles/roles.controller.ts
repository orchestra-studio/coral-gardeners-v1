import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { I18nService } from '../../i18n/i18n.service';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly i18n: I18nService,
    ) { }

    /**
     * GET /api/roles
     * Get all roles with optional pagination and filters
     */
    @Get()
    @Permissions('roles.view')
    async findAll(
        @Query('page') page?: string,
        @Query('page_count') pageCount?: string,
        @Query('name') name?: string,
        @Query('guard_name') guardName?: string,
        @Query('created_from') createdFrom?: string,
        @Query('created_to') createdTo?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : undefined;
        const perPage = pageCount ? parseInt(pageCount, 10) : undefined;

        const result = await this.rolesService.findAll(
            pageNum,
            perPage,
            name,
            guardName,
            createdFrom,
            createdTo
        );

        return {
            success: true,
            data: result,
            message: '',
        };
    }

    /**
     * GET /api/roles/statistics
     * Get roles statistics
     */
    @Get('statistics')
    @Permissions('roles.view')
    async getStatistics() {
        const stats = await this.rolesService.getStatistics();
        return {
            success: true,
            data: stats,
            message: '',
        };
    }

    /**
     * GET /api/roles/select
     * Get roles formatted for dropdown selection
     */
    @Get('select')
    @Permissions('roles.view')
    async getRolesForSelect() {
        const roles = await this.rolesService.getRolesForSelect();
        return {
            success: true,
            data: roles,
            message: '',
        };
    }

    /**
     * GET /api/roles/permissions
     * Get all available permissions
     */
    @Get('permissions')
    @Permissions('roles.view')
    async getAllPermissions() {
        const permissions = await this.rolesService.getAllPermissions();
        return {
            success: true,
            data: permissions,
            message: '',
        };
    }

    /**
     * POST /api/roles
     * Create a new role
     */
    @Post()
    @Permissions('roles.create')
    async create(
        @Body() createRoleDto: { name: string },
        @Headers('accept-language') locale: string,
        @Req() req?: any,
    ) {
        const adminId = req?.user?.id;
        const role = await this.rolesService.create(createRoleDto.name, adminId, locale);
        return {
            success: true,
            data: role,
            message: this.i18n.t('created', 'roles', locale),
        };
    }

    /**
     * GET /api/roles/:id
     * Get role by ID with permissions
     */
    @Get(':id')
    @Permissions('roles.view')
    async findOne(@Param('id') id: string, @Headers('accept-language') locale: string) {
        return await this.rolesService.findOneWithPermissions(Number(id));
    }

    /**
     * PUT /api/roles/:id
     * Update role name
     */
    @Put(':id')
    @Permissions('roles.edit')
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: { name: string },
        @Headers('accept-language') locale: string,
    ) {
        const role = await this.rolesService.update(Number(id), updateRoleDto.name, locale);
        return {
            success: true,
            data: role,
            message: this.i18n.t('updated', 'roles', locale),
        };
    }

    /**
     * POST /api/roles/:id/permissions
     * Update role permissions
     */
    @Post(':id/permissions')
    @Permissions('roles.assign_permissions')
    async updatePermissions(
        @Param('id') id: string,
        @Body() updatePermissionsDto: { permissions: string[] },
        @Headers('accept-language') locale: string,
    ) {
        const role = await this.rolesService.updatePermissions(
            Number(id),
            updatePermissionsDto.permissions,
            locale
        );
        return {
            success: true,
            data: role,
            message: this.i18n.t('permissions_updated', 'roles', locale),
        };
    }

    /**
     * DELETE /api/roles/:id
     * Delete a role
     */
    @Delete(':id')
    @Permissions('roles.delete')
    async remove(
        @Param('id') id: string,
        @Headers('accept-language') locale: string,
    ) {
        await this.rolesService.remove(Number(id), locale);
        return {
            success: true,
            data: null,
            message: this.i18n.t('deleted', 'roles', locale),
        };
    }
}
