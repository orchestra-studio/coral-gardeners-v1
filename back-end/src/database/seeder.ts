import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './config/database.config';
import { seedAdmin, assignSuperAdminRole } from './seeders/admin.seeder';
import { seedCountries } from './seeders/countries.seeder';
import { PermissionSeeder } from './seeders/permission.seeder';
import { seedAppSettings } from './seeders/app-settings.seeder';
import { seedUsers } from './seeders/users.seeder';
import { seedProjects } from './seeders/projects.seeder';
import { seedTasks } from './seeders/tasks.seeder';
import { seedRoles } from './seeders/roles.seeder';

/**
 * Database Seeder - Main Entry Point
 * Runs all seeders in order
 * Works with both MySQL and SQLite
 * 
 * Usage:
 * npx ts-node src/database/seeder.ts
 * OR
 * yarn seed
 */

async function seed() {
    const config = getDatabaseConfig();
    const AppDataSource = new DataSource({
        ...config,
        synchronize: true, // Creates tables automatically
    });

    try {
        await AppDataSource.initialize();
        console.log('📦 Database connection established\n');

        // Run all seeders in correct dependency order
        await seedCountries(AppDataSource);
        await PermissionSeeder.seed(AppDataSource);
        await seedAdmin(AppDataSource); // Must be before roles (roles reference admin_id)
        await seedRoles(AppDataSource);
        // assign Super Admin role to admin@example.com now that roles exist
        await assignSuperAdminRole(AppDataSource);
        await seedAppSettings(AppDataSource);
        await seedUsers(AppDataSource);
        await seedProjects(AppDataSource);
        await seedTasks(AppDataSource);

        console.log('🎉 All seeders completed successfully!');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seed();
