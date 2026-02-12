import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { seedAdmin, assignSuperAdminRole } from './database/seeders/admin.seeder';
import { seedCountries } from './database/seeders/countries.seeder';
import { PermissionSeeder } from './database/seeders/permission.seeder';
import { seedAppSettings } from './database/seeders/app-settings.seeder';
import { seedUsers } from './database/seeders/users.seeder';
import { seedProjects } from './database/seeders/projects.seeder';
import { seedTasks } from './database/seeders/tasks.seeder';
import { seedRoles } from './database/seeders/roles.seeder';

async function autoSeed(dataSource: DataSource) {
    try {
        const result = await dataSource.query('SELECT COUNT(*) as count FROM admins');
        const count = parseInt(result[0].count, 10);
        if (count > 0) {
            console.log('Database already seeded, skipping auto-seed');
            return;
        }
    } catch {
        console.log('Admins table not found or empty, running auto-seed...');
    }

    console.log('Running auto-seed...');
    await seedCountries(dataSource);
    await PermissionSeeder.seed(dataSource);
    await seedAdmin(dataSource);
    await seedRoles(dataSource);
    await assignSuperAdminRole(dataSource);
    await seedAppSettings(dataSource);
    await seedUsers(dataSource);
    await seedProjects(dataSource);
    await seedTasks(dataSource);
    console.log('Auto-seed completed!');
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS
    app.enableCors({
        origin: configService.get('CORS_ORIGIN')
            ? configService.get('CORS_ORIGIN').split(',').map(s => s.trim())
            : ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type,Accept,Authorization',
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // API prefix
    app.setGlobalPrefix('api');

    // Auto-seed database if empty
    const dataSource = app.get(DataSource);
    await autoSeed(dataSource);

    const port = configService.get('PORT') || 3001;
    await app.listen(port);

    console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
