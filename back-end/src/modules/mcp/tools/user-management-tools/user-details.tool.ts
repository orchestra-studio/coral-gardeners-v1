import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

/**
 * User Details Tool
 * Retrieves detailed information about a specific user
 */
@Injectable()
export class UserDetailsTool {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Tool({
        name: 'get-user-by-id',
        description: 'Get detailed information about a specific user by their ID.',
        parameters: z.object({
            userId: z.number().describe('The ID of the user to retrieve'),
        }),
    })
    async getUserById({ userId }: { userId: number }) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                select: ['id', 'first_name', 'last_name', 'email', 'country_id', 'created_at', 'updated_at', 'deleted_at'],
                withDeleted: true,
            });

            if (!user) {
                return {
                    success: false,
                    error: `User with ID ${userId} not found`,
                };
            }

            return {
                success: true,
                user: {
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    country_id: user.country_id,
                    joined: user.created_at,
                    updated: user.updated_at,
                    deleted_at: user.deleted_at,
                    is_deleted: !!user.deleted_at,
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
