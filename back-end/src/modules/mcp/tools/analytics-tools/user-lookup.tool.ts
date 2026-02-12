import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../../../users/users.service';

/**
 * User Lookup Tool
 * Retrieves detailed information about specific users
 */
@Injectable()
export class UserLookupTool {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'get-user-by-username',
        description: 'Retrieve detailed information about a specific user by their username. Excludes sensitive data.',
        parameters: z.object({
            username: z.string().describe('The username of the user to retrieve'),
        }),
    })
    async getUserByUsername({ username }) {
        try {
            const user = await this.usersService.findByUsername(username);

            if (!user) {
                return {
                    success: false,
                    message: `User "${username}" not found`,
                };
            }

            return {
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: `${user.first_name} ${user.last_name}`,
                    country: user.country,
                    isVerified: user.email_verified_at !== null,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
