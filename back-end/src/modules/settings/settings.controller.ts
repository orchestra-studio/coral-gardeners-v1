import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Query,
    Req,
    Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';
import { UpdateAppSettingDto } from './dto/app-setting.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { I18nService } from '../../i18n/i18n.service';

@Controller('settings')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly i18n: I18nService,
    ) { }

    @Get()
    @Permissions('settings.view')
    async findAll(
        @Query('page') page?: string,
        @Query('page_count') page_count?: string,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Headers('accept-language') locale?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const perPage = page_count ? parseInt(page_count, 10) : 10;

        const result = await this.settingsService.findAll(
            pageNumber,
            perPage,
            search,
            category,
        );

        return {
            success: true,
            data: result,
            message: this.i18n.t('retrieved_successfully', 'settings', locale || 'en'),
        };
    }

    @Get(':key')
    @Permissions('settings.view')
    async findOne(
        @Param('key') key: string,
        @Headers('accept-language') locale?: string,
    ) {
        const setting = await this.settingsService.findByKey(key, locale);
        return {
            success: true,
            data: setting,
            message: this.i18n.t('retrieved_successfully', 'settings', locale || 'en'),
        };
    }

    @Patch(':key')
    @Permissions('settings.edit')
    async update(
        @Param('key') key: string,
        @Body() updateAppSettingDto: UpdateAppSettingDto,
        @Req() req?: any,
        @Headers('accept-language') locale?: string,
    ) {
        const adminId = req?.user?.id;
        const setting = await this.settingsService.update(key, updateAppSettingDto, adminId, locale);
        return {
            success: true,
            data: setting,
            message: this.i18n.t('updated_successfully', 'settings', locale || 'en'),
        };
    }

    /**
     * DELETE /api/settings/:key
     * Delete a setting by key
     */
    @Delete(':key')
    @Permissions('settings.edit')
    async delete(
        @Param('key') key: string,
        @Headers('accept-language') locale?: string,
    ) {
        await this.settingsService.delete(key, locale);
        return {
            success: true,
            data: null,
            message: this.i18n.t('deleted_successfully', 'settings', locale || 'en'),
        };
    }
}
