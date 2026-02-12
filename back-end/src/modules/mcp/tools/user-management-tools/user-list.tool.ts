import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

/**
 * User List Tool
 * Retrieves paginated list of users with basic information
 */
@Injectable()
export class UserListTool {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Tool({
        name: 'get-users-list',
        description: 'Get a list of users with their basic information. Returns user details including name, email, and account status.',
        parameters: z.object({
            limit: z.number().optional().describe('Maximum number of users to return (default: 10)'),
            offset: z.number().optional().describe('Number of users to skip (default: 0)'),
        }),
    })
    async getUsersList({ limit = 10, offset = 0 }: { limit?: number; offset?: number }) {
        try {
            const [users, total] = await this.userRepository.findAndCount({
                select: ['id', 'first_name', 'last_name', 'email', 'country_id', 'created_at', 'deleted_at'],
                take: Math.min(limit, 50), // Cap at 50
                skip: offset,
                order: {
                    created_at: 'DESC',
                },
                withDeleted: true,
            });

            return {
                success: true,
                total: total,
                count: users.length,
                users: users.map(u => ({
                    id: u.id,
                    name: `${u.first_name} ${u.last_name}`,
                    email: u.email,
                    country_id: u.country_id,
                    joined: u.created_at,
                    deleted_at: u.deleted_at,
                    is_deleted: !!u.deleted_at,
                })),
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
