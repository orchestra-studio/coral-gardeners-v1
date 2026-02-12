import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Headers,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { I18nService } from '../../i18n/i18n.service';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('users')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly i18n: I18nService,
    ) { }

    /**
     * GET /api/users
     * Get all users with pagination and filters
     */
    @Get()
    @Permissions('users.view')
    async findAll(
        @Query('page') page?: string,
        @Query('page_count') pageCount?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('search') search?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('country_id') countryId?: string,
        @Query('username') username?: string,
        @Query('first_name') firstName?: string,
        @Query('last_name') lastName?: string,
        @Query('from_date') fromDate?: string,
        @Query('to_date') toDate?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const perPage = pageCount ? parseInt(pageCount, 10) : 15;
        const orderDir = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const filters = {
            search,
            email,
            phone,
            country_id: countryId ? parseInt(countryId, 10) : undefined,
            username,
            first_name: firstName,
            last_name: lastName,
            from_date: fromDate,
            to_date: toDate,
        };

        const result = await this.usersService.findAll(pageNum, perPage, filters, orderDir);

        return {
            success: true,
            data: result,
            message: '',
        };
    }

    /**
     * GET /api/users/deleted
     * Get all deleted users with pagination
     */
    @Get('deleted')
    @Permissions('users.view')
    async findDeleted(
        @Query('page') page?: string,
        @Query('page_count') pageCount?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('search') search?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('username') username?: string,
        @Query('first_name') firstName?: string,
        @Query('last_name') lastName?: string,
        @Query('from_date') fromDate?: string,
        @Query('to_date') toDate?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const perPage = pageCount ? parseInt(pageCount, 10) : 15;
        const orderDir = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const filters = {
            search,
            email,
            phone,
            username,
            first_name: firstName,
            last_name: lastName,
            from_date: fromDate,
            to_date: toDate,
        };

        const result = await this.usersService.findDeleted(pageNum, perPage, filters, orderDir);

        return {
            success: true,
            data: result,
            message: '',
        };
    }

    /**
     * GET /api/users/statistic
     * Get users statistics
     */
    @Get('statistic')
    @Permissions('users.view')
    async getStatistics() {
        const stats = await this.usersService.getStatistics();

        return {
            success: true,
            data: stats,
            message: '',
        };
    }

    /**
     * GET /api/users/:username
     * Get a single user by username
     */
    @Get(':username')
    @Permissions('users.view')
    async findOne(
        @Param('username') username: string,
    ) {
        const user = await this.usersService.findByUsername(username);

        return {
            success: true,
            data: user,
            message: '',
        };
    }

    /**
     * POST /api/users
     * Create a new user
     */
    @Post()
    @Permissions('users.create')
    async create(
        @Body() createUserDto: CreateUserDto,
        @Headers('accept-language') locale?: string,
        @Req() req?: any,
    ) {
        const adminId = req?.user?.id;
        const user = await this.usersService.create(createUserDto, adminId);

        return {
            success: true,
            data: user,
            message: this.i18n.t('created', 'users', locale || 'en'),
        };
    }

    /**
     * PATCH /api/users/:username
     * Update a user
     */
    @Patch(':username')
    @Permissions('users.update')
    async update(
        @Param('username') username: string,
        @Body() updateUserDto: UpdateUserDto,
        @Headers('accept-language') locale?: string,
    ) {
        const user = await this.usersService.update(username, updateUserDto);

        return {
            success: true,
            data: user,
            message: this.i18n.t('updated', 'users', locale || 'en'),
        };
    }

    /**
     * PATCH /api/users/:username/change-password
     * Change user password
     */
    @Patch(':username/change-password')
    @Permissions('users.update')
    async changePassword(
        @Param('username') username: string,
        @Body() changePasswordDto: ChangePasswordDto,
        @Headers('accept-language') locale?: string,
    ) {
        await this.usersService.changePassword(username, changePasswordDto.new_password);

        return {
            success: true,
            data: null,
            message: this.i18n.t('passwordChanged', 'users', locale || 'en'),
        };
    }

    /**
     * POST /api/users/:username/resend-verification-email
     * Resend verification email (placeholder - actual email sending not implemented)
     */
    @Post(':username/resend-verification-email')
    @Permissions('users.update')
    async resendVerificationEmail(
        @Param('username') username: string,
        @Headers('accept-language') locale?: string,
    ) {
        // In a real application, you would send an email here
        // For now, we'll just return success
        return {
            success: true,
            data: null,
            message: this.i18n.t('verificationEmailSent', 'users', locale || 'en'),
        };
    }

    /**
     * POST /api/users/:username/make-verified
     * Mark user email as verified
     */
    @Post(':username/make-verified')
    @Permissions('users.verify')
    async markEmailVerified(
        @Param('username') username: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.usersService.markEmailVerified(username);

        return {
            success: true,
            data: null,
            message: this.i18n.t('emailVerified', 'users', locale || 'en'),
        };
    }

    /**
     * POST /api/users/:username/make-unverified
     * Mark user email as unverified
     */
    @Post(':username/make-unverified')
    @Permissions('users.verify')
    async markEmailUnverified(
        @Param('username') username: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.usersService.markEmailUnverified(username);

        return {
            success: true,
            data: null,
            message: this.i18n.t('emailUnverified', 'users', locale || 'en'),
        };
    }

    /**
     * DELETE /api/users/:username
     * Soft delete a user
     */
    @Delete(':username')
    @Permissions('users.delete')
    async delete(
        @Param('username') username: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.usersService.delete(username);

        return {
            success: true,
            data: null,
            message: this.i18n.t('deleted', 'users', locale || 'en'),
        };
    }

    /**
     * POST /api/users/deleted/:username/restore
     * Restore a soft-deleted user
     */
    @Post('deleted/:username/restore')
    @Permissions('users.restore')
    async restore(
        @Param('username') username: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.usersService.restore(username);

        return {
            success: true,
            data: null,
            message: this.i18n.t('restored', 'users', locale || 'en'),
        };
    }

    /**
     * GET /api/users/deleted/:username
     * Get a deleted user by username
     */
    @Get('deleted/:username')
    @Permissions('users.view')
    async findDeletedUser(
        @Param('username') username: string,
    ) {
        const user = await this.usersService.findDeletedByUsername(username);

        return {
            success: true,
            data: user,
            message: '',
        };
    }
}
