import { DataSource } from 'typeorm';
import { getDatabaseConfig, isMySQL } from '../config/database.config';

async function dropAllTables() {
    const dataSource = new DataSource(getDatabaseConfig());

    try {
        await dataSource.initialize();
        console.log('📦 Database connection established');

        // Disable foreign key checks (MySQL specific)
        if (isMySQL()) {
            await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
            console.log('� Foreign key checks disabled');
        } else {
            // SQLite: Disable foreign keys
            await dataSource.query('PRAGMA foreign_keys = OFF');
            console.log('🔓 Foreign key checks disabled (SQLite)');
        }

        // Drop all tables
        const tables = [
            'chat_messages',
            'chat_sessions',
            'admin_role',
            'role_permissions',
            'tasks',
            'projects',
            'users',
            'app_settings',
            'permissions',
            'roles',
            'admins',
            'countries',
        ];

        for (const table of tables) {
            try {
                await dataSource.query(`DROP TABLE IF EXISTS ${table}`);
                console.log(`🗑️  Dropped table: ${table}`);
            } catch (error) {
                console.log(`⚠️  Could not drop table: ${table}`);
            }
        }

        // Re-enable foreign key checks
        if (isMySQL()) {
            await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('🔒 Foreign key checks enabled');
        } else {
            await dataSource.query('PRAGMA foreign_keys = ON');
            console.log('🔒 Foreign key checks enabled (SQLite)');
        }

        await dataSource.destroy();
        console.log('✅ All tables dropped successfully!');
        console.log('💡 Run your app with synchronize: true or run migrations to recreate tables');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

dropAllTables();
