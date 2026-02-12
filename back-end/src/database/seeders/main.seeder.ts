import { DataSource } from 'typeorm';
import { PermissionSeeder } from './permission.seeder';

/**
 * Main Seeder Runner
 * Run all seeders in order
 */
export class MainSeeder {
    static async run(dataSource: DataSource): Promise<void> {
        console.log('🌱 Starting database seeding...');

        try {
            // Seed permissions
            console.log('\n📋 Seeding permissions...');
            await PermissionSeeder.seed(dataSource);

            console.log('\n✅ All seeders completed successfully!');
        } catch (error) {
            console.error('❌ Seeding failed:', error);
            throw error;
        }
    }
}
