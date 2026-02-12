import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../../../users/users.service';

/**
 * User Statistics Tool
 * Provides quick user statistics summary
 */
@Injectable()
export class UserStatisticsTool {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'get-user-statistics',
        description: 'Get quick user statistics summary (total count, verified count, recent activity). Use for numerical summaries only. For charts/visualizations, use display-chart-to-user instead.',
        parameters: z.object({}),
    })
    async getUserStatistics() {
        try {
            const stats = await this.usersService.getStatistics();

            return {
                success: true,
                data: stats,
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get user statistics: ${error.message}`,
            };
        }
    }
}
