import { DataSource } from 'typeorm';
import { Task } from '../../modules/tasks/entities/task.entity';

export const seedTasks = async (dataSource: DataSource) => {
    const taskRepository = dataSource.getRepository(Task);

    console.log('📝 Seeding tasks...');

    // Check if tasks already exist
    const count = await taskRepository.count();
    if (count > 0) {
        console.log('✅ Tasks already seeded');
        return;
    }

    // Determine admin id for tasks
    let adminResult = await dataSource.query('SELECT id FROM admins WHERE email = ? LIMIT 1', ['admin@example.com']);
    let adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
    if (!adminId) {
        adminResult = await dataSource.query('SELECT id FROM admins ORDER BY id ASC LIMIT 1');
        adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
    }
    if (!adminId) {
        const existingAdmins = await dataSource.query('SELECT id, email FROM admins LIMIT 10');
        throw new Error(`No admin available for tasks seeder; admins present: ${JSON.stringify(existingAdmins)}`);
    }

    const tasks = [
        {
            text: 'Review and merge pending pull requests',
            completed: false,
            adminId: adminId,
        },
        {
            text: 'Update project documentation',
            completed: false,
            adminId: adminId,
        },
        {
            text: 'Schedule team meeting for Q1 planning',
            completed: true,
            adminId: adminId,
        },
        {
            text: 'Optimize database queries for better performance',
            completed: false,
            adminId: adminId,
        },
        {
            text: 'Implement user authentication improvements',
            completed: false,
            adminId: adminId,
        },
        {
            text: 'Set up CI/CD pipeline for staging environment',
            completed: true,
            adminId: adminId,
        },
        {
            text: 'Review security audit report',
            completed: false,
            adminId: adminId,
        },
        {
            text: 'Update dependencies to latest versions',
            completed: true,
            adminId: adminId,
        },
        {
            text: 'Create API documentation for new endpoints',
            completed: false,
            adminId: adminId,
        },
        {
            text: 'Conduct code review for mobile app updates',
            completed: false,
            adminId: adminId,
        },
    ];

    await taskRepository.save(tasks);
    console.log(`✅ ${tasks.length} tasks seeded successfully`);
};
