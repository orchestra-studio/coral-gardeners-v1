import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

/**
 * Restore User Tool
 * Restores a soft-deleted user
 */
@Injectable()
export class RestoreUserTool {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Tool({
        name: 'restore-user',
        description: 'Restore a previously deleted user by their ID. The user will be reactivated in the system.',
        parameters: z.object({
            userId: z.number().describe('The ID of the user to restore'),
        }),
    })
    async restoreUser({ userId }: { userId: number }) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                withDeleted: true,
            });

            if (!user) {
                return {
                    success: false,
                    error: `User with ID ${userId} not found`,
                };
            }

            if (!user.deleted_at) {
                return {
                    success: false,
                    error: `User with ID ${userId} is not deleted`,
                };
            }

            await this.userRepository.restore(userId);

            return {
                success: true,
                message: `User "${user.first_name} ${user.last_name}" (ID: ${userId}) has been successfully restored`,
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
