import { Injectable, Scope } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../../../users/users.service';

/**
 * List Users Tool
 * Lists users with pagination and search capabilities
 */
@Injectable({ scope: Scope.REQUEST })
export class ListUsersTool {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'list-users',
        description: 'List users with optional search term. Returns paginated user list with basic information.',
        parameters: z.object({
            page: z.number().min(1).optional().describe('Page number (default: 1)'),
            limit: z.number().min(1).max(100).optional().describe('Items per page (default: 10, max: 100)'),
            search: z.string().optional().describe('Search users by name, email, or username'),
        }),
    })
    async listUsers({
        page = 1,
        limit = 10,
        search,
    }: {
        page?: number;
        limit?: number;
        search?: string;
    }) {
        try {
            const result = await this.usersService.findAll(page, limit, { search });

            return {
                success: true,
                data: result.data.map(u => ({
                    id: u.id,
                    name: `${u.first_name} ${u.last_name}`,
                    email: u.email,
                    username: u.username,
                    phone: u.phone,
                    country: u.country?.name_en || 'N/A',
                    created_at: u.created_at,
                })),
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
