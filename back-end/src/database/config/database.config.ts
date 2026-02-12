import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Get database configuration based on DB_TYPE environment variable
 * Supports both MySQL and SQLite
 */
export function getDatabaseConfig(): DataSourceOptions {
    const dbType = process.env.DB_TYPE || 'mysql';

    if (dbType === 'sqlite') {
        return {
            type: 'better-sqlite3',
            database: process.env.SQLITE_DATABASE || './database.sqlite',
            entities: ['src/**/*.entity.ts'],
            synchronize: false,
        };
    }

    // Default to MySQL
    return {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'dashboard_db',
        entities: ['src/**/*.entity.ts'],
        synchronize: false,
    };
}

/**
 * Check if current database is MySQL
 */
export function isMySQL(): boolean {
    return (process.env.DB_TYPE || 'mysql') === 'mysql';
}

/**
 * Check if current database is SQLite
 */
export function isSQLite(): boolean {
    return process.env.DB_TYPE === 'sqlite';
}
