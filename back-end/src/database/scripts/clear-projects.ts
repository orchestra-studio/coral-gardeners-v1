import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function clearProjects() {
    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
    });

    try {
        await dataSource.initialize();
        console.log('📦 Database connection established');

        // Clear projects table
        await dataSource.query('DELETE FROM projects');
        console.log('🗑️  Projects table cleared successfully');

        await dataSource.destroy();
        console.log('✅ Done!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearProjects();
