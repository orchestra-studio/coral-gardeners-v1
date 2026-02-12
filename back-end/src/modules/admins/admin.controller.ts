import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,
    Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, UpdateAdminRolesDto, ChangePasswordDto } from './dto/admin.dto';
import { I18nService } from '../../i18n/i18n.service';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('admins')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly i18n: I18nService,
    ) { }

    /**
     * POST /api/admins
     * Create a new admin
     */
    @Post()
    @Permissions('admins.create')
    async create(
        @Body() createAdminDto: CreateAdminDto,
        @Headers('accept-language') locale: string,
    ) {
        const admin = await this.adminService.create(createAdminDto);
        return {
            success: true,
            data: admin,
            message: this.i18n.t('created', 'admin', locale),
        };
    }

    /**
     * GET /api/admins
     * Get all admins with pagination
     */
    @Get()
    @Permissions('admins.view')
    async findAll(
        @Query('page') page: number = 1,
        @Query('page_count') pageCount: number = 10,
        @Query('email') email: string,
        @Query('name') name: string,
        @Query('phone') phone: string,
    ) {
        const filters = { email, name, phone };
        const result = await this.adminService.findAll(Number(page), Number(pageCount), filters);
        return {
            success: true,
            data: result,
            message: '',
        };
    }

    /**
     * GET /api/admins/statistics
     * Get admin statistics
     * IMPORTANT: This must come BEFORE /:id routes to avoid conflicts
     */
    @Get('statistics')
    @Permissions('admins.view')
    async getStatistics() {
        const stats = await this.adminService.getStatistics();
        return {
            success: true,
            data: stats,
            message: '',
        };
    }

    /**
     * PATCH /api/admins/profile
     * Update current admin's profile
     * IMPORTANT: This must come BEFORE /:id routes to avoid conflicts
     */
    @Patch('profile')
    @Permissions('admins.edit')
    async updateProfile(
        @Body() updateAdminDto: UpdateAdminDto,
        @Req() request: any,
        @Headers('accept-language') locale: string,
    ) {
        const admin = request.user;
        const updatedAdmin = await this.adminService.updateProfile(admin.id, updateAdminDto);
        return {
            success: true,
            data: updatedAdmin,
            message: this.i18n.t('profile_updated', 'admin', locale),
        };
    }

    /**
     * PATCH /api/admins/profile/password
     * Change current admin's password
     * IMPORTANT: This must come BEFORE /:id routes to avoid conflicts
     */
    @Patch('profile/password')
    async changePassword(
        @Body() passwordData: ChangePasswordDto,
        @Req() request: any,
        @Headers('accept-language') locale: string,
    ) {
        const admin = request.user;
        await this.adminService.changePassword(admin.id, passwordData, locale);
        return {
            success: true,
            data: null,
            message: this.i18n.t('password_changed', 'admin', locale),
        };
    }

    /**
     * GET /api/admins/:id
     * Get one admin by ID or username
     */
    @Get(':id')
    @Permissions('admins.view')
    async findOne(
        @Param('id') id: string,
    ) {
        // Try to parse as number (ID), otherwise treat as username
        const numericId = Number(id);
        const admin = isNaN(numericId)
            ? await this.adminService.findByUsername(id)
            : await this.adminService.findOne(numericId);

        return {
            success: true,
            data: admin,
            message: '',
        };
    }

    /**
     * PATCH /api/admins/:id
     * Update admin by ID or username
     */
    @Patch(':id')
    @Permissions('admins.edit')
    async update(
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto,
        @Headers('accept-language') locale: string,
    ) {
        const numericId = Number(id);
        const adminId = isNaN(numericId)
            ? (await this.adminService.findByUsername(id)).id
            : numericId;

        const admin = await this.adminService.update(adminId, updateAdminDto);
        return {
            success: true,
            data: admin,
            message: this.i18n.t('updated', 'admin', locale),
        };
    }

    /**
     * PATCH /api/admins/:id/roles
     * Update admin roles by ID or username
     */
    @Patch(':id/roles')
    @Permissions('admins.assign_roles')
    async updateRoles(
        @Param('id') id: string,
        @Body() updateRolesDto: UpdateAdminRolesDto,
        @Headers('accept-language') locale: string,
    ) {
        const numericId = Number(id);
        const adminId = isNaN(numericId)
            ? (await this.adminService.findByUsername(id)).id
            : numericId;

        await this.adminService.updateRoles(adminId, updateRolesDto);

        // Fetch and return the updated admin data
        const updatedAdmin = await this.adminService.findOne(adminId);

        return {
            success: true,
            data: updatedAdmin,
            message: this.i18n.t('roles_updated', 'admin', locale),
        };
    }

    /**
     * DELETE /api/admins/:id
     * Delete admin by ID or username
     */
    @Delete(':id')
    @Permissions('admins.delete')
    async remove(
        @Param('id') id: string,
        @Headers('accept-language') locale: string,
    ) {
        const numericId = Number(id);
        const adminId = isNaN(numericId)
            ? (await this.adminService.findByUsername(id)).id
            : numericId;

        await this.adminService.remove(adminId);
        return {
            success: true,
            data: null,
            message: this.i18n.t('deleted', 'admin', locale),
        };
    }
}
