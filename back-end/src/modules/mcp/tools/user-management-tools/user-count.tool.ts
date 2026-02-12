import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

/**
 * User Count Tool
 * Retrieves total number of users in the system
 */
@Injectable()
export class UserCountTool {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Tool({
        name: 'get-users-count',
        description: 'Get the total number of users in the system. Returns the count of all registered users.',
        parameters: z.object({}),
    })
    async getUsersCount() {
        try {
            const count = await this.userRepository.count({ withDeleted: true });

            return {
                success: true,
                count: count,
                message: `There are ${count} users in the system`,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
