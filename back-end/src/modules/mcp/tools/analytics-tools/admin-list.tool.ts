import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { AdminService } from '../../../admins/admin.service';

/**
 * Admin List Tool
 * Retrieves list of system administrators
 */
@Injectable()
export class AdminListTool {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    @Tool({
        name: 'get-admins-list',
        description: 'Retrieve list of system administrators with their roles and permissions. For administrative analytics.',
        parameters: z.object({
            limit: z.number().min(1).max(100).default(20).describe('Number of admins to return'),
        }),
    })
    async getAdminsList({ limit }) {
        try {
            const admins = await this.adminService.findAll(
                1,
                limit,
                {},
            );

            return {
                success: true,
                count: admins.data.length,
                total: admins.total,
                admins: admins.data.map(admin => ({
                    id: admin.id,
                    fullName: admin.fullName,
                    email: admin.email,
                    roles: admin.roles?.map(r => r.name) || [],
                    createdAt: admin.createdAt,
                })),
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
