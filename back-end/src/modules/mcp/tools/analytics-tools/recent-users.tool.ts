import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../../../users/users.service';

/**
 * Recent Users Tool
 * Retrieves recently registered users
 */
@Injectable()
export class RecentUsersTool {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'get-recent-users',
        description: 'Retrieve the most recently registered users. Returns user information excluding sensitive data like passwords.',
        parameters: z.object({
            limit: z.number().min(1).max(100).default(10).describe('Number of users to return (1-100, default: 10)'),
        }),
    })
    async getRecentUsers({ limit }) {
        try {
            const users = await this.usersService.findAll(
                1,
                limit,
                {},
                'DESC',
            );

            return {
                success: true,
                count: users.data.length,
                total: users.total,
                users: users.data.map(user => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: `${user.first_name} ${user.last_name}`,
                    country: user.country,
                    isVerified: user.email_verified_at !== null,
                    createdAt: user.created_at,
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
