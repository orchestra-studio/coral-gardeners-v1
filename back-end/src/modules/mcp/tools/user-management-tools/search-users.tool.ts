import { Injectable, Scope } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../../../users/users.service';

/**
 * Search Users Tool
 * Searches for users across multiple fields
 */
@Injectable({ scope: Scope.REQUEST })
export class SearchUsersTool {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'search-users',
        description: 'Search for users across multiple fields (name, email, username). Returns matching users.',
        parameters: z.object({
            query: z.string().min(2).describe('Search query (minimum 2 characters)'),
            limit: z.number().min(1).max(50).optional().describe('Maximum results to return (default: 20, max: 50)'),
        }),
    })
    async searchUsers({
        query,
        limit = 20,
    }: {
        query: string;
        limit?: number;
    }) {
        try {
            const result = await this.usersService.findAll(1, limit, { search: query });

            return {
                success: true,
                query,
                total_results: result.total,
                data: result.data.map(u => ({
                    id: u.id,
                    name: `${u.first_name} ${u.last_name}`,
                    email: u.email,
                    username: u.username,
                    phone: u.phone,
                    country: u.country?.name_en || 'N/A',
                    created_at: u.created_at,
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
