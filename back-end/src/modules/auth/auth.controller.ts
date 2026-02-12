import {
    Controller,
    Post,
    Body,
    Req,
    Get,
    UseGuards,
    Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../admins/dto/admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { I18nService } from '../../i18n/i18n.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly i18n: I18nService,
    ) { }

    /**
     * POST /api/auth/login
     * Login endpoint for admin users
     */
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Headers('accept-language') locale: string,
    ) {
        const result = await this.authService.login(loginDto);
        return {
            success: true,
            data: result,
            message: this.i18n.t('login_success', 'auth', locale),
        };
    }

    /**
     * GET /api/auth/me
     * Get current authenticated admin with roles and permissions
     */
    @Get('me')
    @UseGuards(AuthGuard('bearer'))
    async getCurrentAdmin(
        @Req() request: any,
    ) {
        const admin = request.user;

        // Get admin with roles and permissions (same as login)
        const adminWithPermissions = await this.authService.getAdminWithPermissions(admin.id);

        return {
            success: true,
            data: adminWithPermissions,
            message: '',
        };
    }
}
