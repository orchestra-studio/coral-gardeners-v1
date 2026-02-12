import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { I18nModule } from '../../i18n/i18n.module';
import { AdminModule } from '../admins/admin.module';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        I18nModule,
        AdminModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, PermissionsGuard],
    exports: [UsersService],
})
export class UsersModule { }
