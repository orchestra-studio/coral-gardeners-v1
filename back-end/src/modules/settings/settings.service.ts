import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting } from './entities/app-setting.entity';
import { UpdateAppSettingDto } from './dto/app-setting.dto';
import { I18nService } from '../../i18n/i18n.service';

export interface PaginatedAppSettingsResponse {
    data: AppSetting[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(AppSetting)
        private appSettingRepository: Repository<AppSetting>,
        private readonly i18n: I18nService,
    ) { }

    async findAll(
        page: number = 1,
        perPage: number = 10,
        search?: string,
        category?: string,
    ): Promise<PaginatedAppSettingsResponse> {
        const skip = (page - 1) * perPage;

        // Build where clause
        const where: any = {};

        if (category) {
            where.category = category;
        }

        // For search, we need to use query builder since we want to search across multiple fields
        const queryBuilder = this.appSettingRepository.createQueryBuilder('setting');

        if (category) {
            queryBuilder.andWhere('setting.category = :category', { category });
        }

        if (search) {
            queryBuilder.andWhere(
                '(setting.key LIKE :search OR setting.value LIKE :search OR ' +
                'setting.display_name LIKE :search OR ' +
                'setting.description LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Get total count
        const total = await queryBuilder.getCount();

        // Get paginated data
        const data = await queryBuilder
            .orderBy('setting.category', 'ASC')
            .addOrderBy('setting.key', 'ASC')
            .skip(skip)
            .take(perPage)
            .getMany();

        return {
            data,
            page,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        };
    }

    async findByKey(key: string, locale?: string): Promise<AppSetting> {
        const setting = await this.appSettingRepository.findOne({
            where: { key },
        });

        if (!setting) {
            throw new NotFoundException(
                locale ? this.i18n.t('not_found', 'settings', locale) : `Setting with key "${key}" not found`
            );
        }

        return setting;
    }

    async update(
        key: string,
        updateAppSettingDto: UpdateAppSettingDto,
        adminId?: number,
        locale?: string,
    ): Promise<AppSetting> {
        const setting = await this.findByKey(key, locale);

        setting.value = updateAppSettingDto.value;
        setting.updated_at = new Date();
        if (adminId) {
            setting.admin_id = adminId;
        }

        return this.appSettingRepository.save(setting);
    }

    async getValue(key: string): Promise<string> {
        const setting = await this.findByKey(key);
        return setting.value;
    }

    async getValueOrDefault(key: string, defaultValue: string): Promise<string> {
        try {
            return await this.getValue(key);
        } catch {
            return defaultValue;
        }
    }

    /**
     * Delete a setting by key
     */
    async delete(key: string, locale?: string): Promise<void> {
        const setting = await this.findByKey(key, locale);
        await this.appSettingRepository.remove(setting);
    }
}
