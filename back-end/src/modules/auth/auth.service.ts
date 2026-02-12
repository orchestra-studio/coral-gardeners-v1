import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admins/admin.service';
import { Admin } from '../admins/entities/admin.entity';
import { LoginDto } from '../admins/dto/admin.dto';

export interface TokenPayload {
    sub: number; // admin id
    email: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: string;
    admin: {
        id: number;
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        full_name: string;
        profile_picture: string | null;
        roles: Array<{
            id: number;
            name: string;
            guard_name: string;
        }>;
        permissions: string[];
    };
}

@Injectable()
export class AuthService {
    constructor(
        private adminService: AdminService,
        private jwtService: JwtService,
    ) { }

    /**
     * Login admin and generate bearer token
     */
    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

        // Check if admin exists
        const adminExists = await this.adminService.findByEmail(email);

        if (!adminExists) {
            throw new NotFoundException('email_not_found');
        }

        // Validate admin credentials (check password)
        const admin = await this.adminService.validateAdmin(email, password);

        if (!admin) {
            throw new UnauthorizedException('password_incorrect');
        }

        // Get admin with roles and permissions
        const rolesWithPermissions = await this.adminService.getAdminRolesWithPermissions(admin.id);

        // Extract unique permissions from all roles
        const allPermissions = rolesWithPermissions
            .flatMap(role => role.permissions || []);

        const uniquePermissions = [...new Set(allPermissions)];

        // Generate JWT token
        const payload: TokenPayload = {
            sub: admin.id,
            email: admin.email,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            token_type: 'Bearer',
            expires_in: '7d',
            admin: {
                id: admin.id,
                email: admin.email,
                username: admin.username,
                first_name: admin.first_name,
                last_name: admin.last_name,
                full_name: `${admin.first_name} ${admin.last_name}`,
                profile_picture: admin.profile_picture,
                roles: rolesWithPermissions.map(role => ({
                    id: role.id,
                    name: role.name,
                    guard_name: role.guard_name,
                })),
                permissions: uniquePermissions,
            },
        };
    }

    /**
     * Validate JWT token and return admin
     */
    async validateToken(token: string): Promise<Admin | null> {
        try {
            const payload = this.jwtService.verify(token) as TokenPayload;

            // Find admin by email
            const admin = await this.adminService.findByEmail(payload.email);

            if (!admin) {
                return null;
            }

            return admin;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get current authenticated admin from request
     */
    async getCurrentAdmin(request: any): Promise<Admin> {
        return request.user;
    }

    /**
     * Get admin with roles and permissions
     */
    async getAdminWithPermissions(adminId: number) {
        const admin = await this.adminService.findOne(adminId);

        if (!admin) {
            throw new UnauthorizedException('Admin not found');
        }

        // Get admin with roles and permissions
        const rolesWithPermissions = await this.adminService.getAdminRolesWithPermissions(adminId);

        // Extract unique permissions from all roles
        const allPermissions = rolesWithPermissions
            .flatMap(role => role.permissions || []);

        const uniquePermissions = [...new Set(allPermissions)];

        return {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            first_name: admin.first_name,
            last_name: admin.last_name,
            full_name: `${admin.first_name} ${admin.last_name}`,
            profile_picture: admin.profile_picture,
            phone: admin.phone,
            country_id: admin.country_id,
            created_at: admin.created_at,
            updated_at: admin.updated_at,
            roles: rolesWithPermissions.map(role => ({
                id: role.id,
                name: role.name,
                guard_name: role.guard_name,
            })),
            permissions: uniquePermissions,
        };
    }
}
