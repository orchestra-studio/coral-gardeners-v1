import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

/**
 * Delete User Tool
 * Soft deletes a user from the system
 */
@Injectable()
export class DeleteUserTool {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Tool({
        name: 'delete-user',
        description: 'Soft delete a user from the system by their ID. The user will be marked as deleted but not removed from the database.',
        parameters: z.object({
            userId: z.number().describe('The ID of the user to delete'),
        }),
    })
    async deleteUser({ userId }: { userId: number }) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                return {
                    success: false,
                    error: `User with ID ${userId} not found`,
                };
            }

            if (user.deleted_at) {
                return {
                    success: false,
                    error: `User with ID ${userId} is already deleted`,
                };
            }

            await this.userRepository.softDelete(userId);

            return {
                success: true,
                message: `User "${user.first_name} ${user.last_name}" (ID: ${userId}) has been successfully deleted`,
                user: {
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
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
