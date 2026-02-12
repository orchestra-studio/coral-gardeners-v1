import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AppSetting } from './entities/app-setting.entity';
import { AdminModule } from '../admins/admin.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AppSetting]),
        AdminModule,
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
