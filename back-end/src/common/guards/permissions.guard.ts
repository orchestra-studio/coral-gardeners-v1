import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminService } from '../../modules/admins/admin.service';

/**
 * Permissions Guard
 * Validates that the authenticated admin has the required permissions
 * Works in conjunction with @Permissions() decorator
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private adminService: AdminService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Get required permissions from @Permissions() decorator
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

        // If no permissions required, allow access
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // Get authenticated admin from request (set by AuthGuard)
        const request = context.switchToHttp().getRequest();
        const admin = request.user;

        if (!admin) {
            throw new ForbiddenException('No authenticated user found');
        }

        // Get admin's permissions
        const rolesWithPermissions = await this.adminService.getAdminRolesWithPermissions(admin.id);

        // Flatten all permissions from all roles
        const adminPermissions = rolesWithPermissions
            .flatMap(role => role.permissions || []);

        // Remove duplicates
        const uniquePermissions = [...new Set(adminPermissions)];

        // Check if admin has ANY of the required permissions (OR logic)
        const hasPermission = requiredPermissions.some(permission =>
            uniquePermissions.includes(permission)
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                `You need one of these permissions: ${requiredPermissions.join(', ')}`
            );
        }

        return true;
    }
}
