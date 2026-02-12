import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BearerStrategy } from './strategies/bearer.strategy';
import { AuthGateway } from './auth.gateway';
import { AdminModule } from '../admins/admin.module';
import { I18nModule } from '../../i18n/i18n.module';

@Module({
    imports: [
        forwardRef(() => AdminModule),
        I18nModule,
        PassportModule.register({ defaultStrategy: 'bearer' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION') || '7d',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, BearerStrategy, AuthGateway],
    controllers: [AuthController],
    exports: [AuthService, AuthGateway],
})
export class AuthModule { }
