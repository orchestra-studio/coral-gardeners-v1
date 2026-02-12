import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/role.entity';
import { AdminRole } from '../../modules/admins/entities/admin-role.entity';
import { Admin } from '../../modules/admins/entities/admin.entity';
import { generateUsername } from '../../common/utils';

/**
 * Admin Seeder
 * Creates initial admin users for the application
 * Note: Passwords are stored as plain text here and will be hashed by the @BeforeInsert hook in the Admin entity
 */
export async function seedAdmin(dataSource: DataSource) {
    console.log('👤 Seeding admin users...');

    const adminRepository = dataSource.getRepository(Admin);

    try {
        const admins = [
            {
                first_name: 'Super',
                last_name: 'Admin',
                email: 'admin@example.com',
                password: 'Admin@123',
                phone: '+1234567890',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
            {
                first_name: 'John',
                last_name: 'Smith',
                email: 'john.smith@admin.com',
                password: 'admin123',
                phone: '+1555100200',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
            {
                first_name: 'Sarah',
                last_name: 'Jones',
                email: 'sarah.jones@admin.com',
                password: 'admin123',
                phone: '+1555300400',
                profile_picture: '/assets/images/avatar/person/person-female-2.png',
            },
            {
                first_name: 'Michael',
                last_name: 'Brown',
                email: 'michael.brown@admin.com',
                password: 'admin123',
                phone: '+1555500600',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
            {
                first_name: 'Emily',
                last_name: 'Davis',
                email: 'emily.davis@admin.com',
                password: 'admin123',
                phone: '+1555700800',
                profile_picture: '/assets/images/avatar/person/person-female-2.png',
            },
            {
                first_name: 'David',
                last_name: 'Wilson',
                email: 'david.wilson@admin.com',
                password: 'admin123',
                phone: '+1555900100',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
            {
                first_name: 'Lisa',
                last_name: 'Anderson',
                email: 'lisa.anderson@admin.com',
                password: 'admin123',
                phone: '+1555110220',
                profile_picture: '/assets/images/avatar/person/person-female-2.png',
            },
            {
                first_name: 'James',
                last_name: 'Garcia',
                email: 'james.garcia@admin.com',
                password: 'admin123',
                phone: '+1555330440',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
            {
                first_name: 'Maria',
                last_name: 'Martinez',
                email: 'maria.martinez@admin.com',
                password: 'admin123',
                phone: '+1555550660',
                profile_picture: '/assets/images/avatar/person/person-female-2.png',
            },
            {
                first_name: 'Robert',
                last_name: 'Thomas',
                email: 'robert.thomas@admin.com',
                password: 'admin123',
                phone: '+1555770880',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
            {
                first_name: 'Jennifer',
                last_name: 'Taylor',
                email: 'jennifer.taylor@admin.com',
                password: 'admin123',
                phone: '+1555990010',
                profile_picture: '/assets/images/avatar/person/person-female-2.png',
            },
            {
                first_name: 'William',
                last_name: 'Moore',
                email: 'william.moore@admin.com',
                password: 'admin123',
                phone: '+1555112233',
                profile_picture: '/assets/images/avatar/person/person-2.png',
            },
        ];

        let superAdminId: number | null = null;
        for (let i = 0; i < admins.length; i++) {
            const adminData = admins[i];
            const isFirstAdmin = i === 0;

            // Check if admin already exists
            const existing = await adminRepository.findOne({
                where: { email: adminData.email }
            });

            if (!existing) {
                // Generate username
                const username = await generateUsername(adminData.first_name, adminData.last_name, adminRepository);

                const admin = adminRepository.create({
                    ...adminData,
                    username,
                    admin_id: isFirstAdmin ? null : (superAdminId || 1)
                });
                const savedAdmin = await adminRepository.save(admin);

                if (isFirstAdmin) {
                    superAdminId = savedAdmin.id;
                }
            } else if (isFirstAdmin) {
                superAdminId = existing.id;
            }
        }

        // Role assignments are now handled after roles are seeded.
        console.log('\n🔐 Super Admin role assignment will be performed after roles seeder runs.');

        console.log('\n✅ All admins created successfully');
        console.log('\n📧 Default admin email: admin@example.com');
        console.log('👤 Default admin username will be auto-generated (firstname-lastname)');
        console.log('🔑 Super Admin password: Admin@123 (other demo admins use admin123)');
        console.log('⚠️  Please change passwords after first login!\n');
    } catch (error) {
        console.error('❌ Error seeding admins:', error);
        throw error;
    }
}

/**
 * Assigns the Super Admin role to the first admin (admin@example.com).
 * Assigns the Viewer role to all other admins.
 * This should be executed after roles have been seeded.
 */
export async function assignSuperAdminRole(dataSource: DataSource) {
    console.log('\n🔐 Assigning roles to admins...');

    const roleRepository = dataSource.getRepository(Role);
    const adminRepository = dataSource.getRepository(Admin);
    const adminRoleRepository = dataSource.getRepository(AdminRole);

    const superAdminRole = await roleRepository.findOne({ where: { name: 'Super Admin' } });
    const viewerRole = await roleRepository.findOne({ where: { name: 'Viewer' } });

    if (!superAdminRole) {
        console.log('⚠️  Super Admin role not found. Run roles seeder first.');
        return;
    }

    if (!viewerRole) {
        console.log('⚠️  Viewer role not found. Run roles seeder first.');
        return;
    }

    // Get super admin
    const result = await dataSource.query('SELECT id FROM admins WHERE email = ? LIMIT 1', ['admin@example.com']);
    if (!result || result.length === 0) {
        console.log('⚠️  admin@example.com not found. Skipping role assignment.');
        return;
    }
    const superAdminId = result[0].id;

    // Assign Super Admin role to admin@example.com
    const existingSuperAdmin = await adminRoleRepository.findOne({
        where: { admin_id: superAdminId, role_id: superAdminRole.id }
    });

    if (!existingSuperAdmin) {
        await adminRoleRepository.save({ admin_id: superAdminId, role_id: superAdminRole.id });
        console.log('✅ Assigned Super Admin role to admin@example.com');
    } else {
        console.log('✓ Super Admin role already assigned to admin@example.com');
    }

    // Assign Viewer role to all other admins
    const allAdmins = await adminRepository.find();
    let viewerAssignedCount = 0;

    for (const admin of allAdmins) {
        // Skip super admin
        if (admin.id === superAdminId) {
            continue;
        }

        // Check if already has viewer role
        const existingViewerRole = await adminRoleRepository.findOne({
            where: { admin_id: admin.id, role_id: viewerRole.id }
        });

        if (!existingViewerRole) {
            await adminRoleRepository.save({ admin_id: admin.id, role_id: viewerRole.id });
            viewerAssignedCount++;
        }
    }

    if (viewerAssignedCount > 0) {
        console.log(`✅ Assigned Viewer role to ${viewerAssignedCount} admins`);
    } else {
        console.log('✓ All other admins already have Viewer role assigned');
    }
}

// Standalone execution
if (require.main === module) {
    import('dotenv').then((dotenv) => dotenv.config());
    import('../config/database.config').then(({ getDatabaseConfig }) => {
        const AppDataSource = new DataSource(getDatabaseConfig());

        (async () => {
            try {
                await AppDataSource.initialize();
                console.log('📦 Database connection established\n');

                await seedAdmin(AppDataSource);

                console.log('🎉 Admin seeding completed successfully!');
            } catch (error) {
                console.error('❌ Seeding error:', error.message);
                process.exit(1);
            } finally {
                await AppDataSource.destroy();
            }
        })();
    });
}
