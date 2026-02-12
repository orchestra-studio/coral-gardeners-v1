import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
    // Parse DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found in environment');
        process.exit(1);
    }

    // Create DataSource for production PostgreSQL
    const dataSource = new DataSource({
        type: 'postgres',
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
        entities: ['dist/**/*.entity.js'],
        synchronize: false,
    });

    try {
        console.log('📡 Connecting to database...');
        await dataSource.initialize();
        console.log('✅ Connected to database');

        const email = 'ludovic@orchestraintelligence.fr';
        const password = 'Admin123!'; // Change this after first login
        const firstName = 'Ludovic';
        const lastName = 'Goutel';

        // Check if user already exists
        const existingUser = await dataSource.query(
            'SELECT id FROM "user" WHERE email = $1',
            [email]
        );

        if (existingUser.length > 0) {
            console.log('⚠️  User already exists with email:', email);
            console.log('📧 Email:', email);
            console.log('🔑 Password: Admin123!');
            process.exit(0);
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin user
        console.log('👤 Creating admin user...');
        const result = await dataSource.query(
            `INSERT INTO "user" (
                email,
                password,
                first_name,
                last_name,
                role,
                email_verified_at,
                created_at,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
                email,
                hashedPassword,
                firstName,
                lastName,
                'ADMIN',
                new Date(), // Email verified
                new Date(),
                new Date(),
            ]
        );

        console.log('\n✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', email);
        console.log('🔑 Password: Admin123!');
        console.log('👤 Name:', firstName, lastName);
        console.log('🔐 Role: ADMIN');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANT: Change your password after first login!\n');

        await dataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}

createAdmin();
