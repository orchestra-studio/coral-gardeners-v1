import { Module } from '@nestjs/common';
import { McpModule as ReKogMcpModule } from '@rekog/mcp-nest';
import { randomUUID } from 'crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admins/admin.module';
import { User } from '../users/entities/user.entity';

// Analytics Tools
import {
    UserStatisticsTool,
    RecentUsersTool,
    UserLookupTool,
    AdminListTool,
    ChartDisplayTool,
} from './tools/analytics-tools';

// User Management Tools
import {
    UserCountTool,
    UserListTool,
    UserDetailsTool,
    ListUsersTool,
    SearchUsersTool,
    DeleteUserTool,
    RestoreUserTool,
    CreateUserTool,
    UpdateUserTool,
} from './tools/user-management-tools';

const analyticsTools = [
    UserStatisticsTool,
    RecentUsersTool,
    UserLookupTool,
    AdminListTool,
    ChartDisplayTool,
];

const userManagementTools = [
    UserCountTool,
    UserListTool,
    UserDetailsTool,
    ListUsersTool,
    SearchUsersTool,
    DeleteUserTool,
    RestoreUserTool,
    CreateUserTool,
    UpdateUserTool,
];

const allTools = [
    ...analyticsTools,
    ...userManagementTools,
];

@Module({
    imports: [
        ReKogMcpModule.forRoot({
            name: 'dashboard-mcp-server',
            version: '1.0.0',
            streamableHttp: {
                enableJsonResponse: true,
                sessionIdGenerator: () => randomUUID(),
                statelessMode: false, // Enable session management
            },
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        AdminModule,
    ],
    providers: allTools,
    exports: [
        ...allTools,
        ReKogMcpModule,
    ],
})
export class McpModule { }
