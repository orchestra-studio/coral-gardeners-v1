import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(token: string): Promise<any> {
        const user = await this.authService.validateToken(token);

        if (!user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return user;
    }
}
