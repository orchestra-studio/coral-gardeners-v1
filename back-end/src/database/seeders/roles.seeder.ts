import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/role.entity';
import { Permission } from '../../modules/roles/entities/permission.entity';
import { RolePermission } from '../../modules/roles/entities/role-permission.entity';

/**
 * Role Seeder
 * Creates default roles for the admin system and attaches permissions
 */
export async function seedRoles(dataSource: DataSource) {
    console.log('🔐 Seeding roles...');

    const roleRepository = dataSource.getRepository(Role);
    const permissionRepository = dataSource.getRepository(Permission);
    const rolePermissionRepository = dataSource.getRepository(RolePermission);

    try {
        // Determine admin id to set as admin_id on roles (if present)
        let adminResult = await dataSource.query('SELECT id FROM admins WHERE email = ? LIMIT 1', ['admin@example.com']);
        let adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
        if (!adminId) {
            adminResult = await dataSource.query('SELECT id FROM admins ORDER BY id ASC LIMIT 1');
            adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
        }
        const rolesData = [
            {
                name: 'Super Admin',
                guard_name: 'web',
                description: 'Full system access with all permissions',
                permissionPattern: 'all', // All permissions
            },
            {
                name: 'Admin',
                guard_name: 'web',
                description: 'Administrative access with most permissions',
                permissionPattern: 'none', // No permissions by default
            },
            {
                name: 'Manager',
                guard_name: 'web',
                description: 'Can manage projects, tasks, and users',
                permissionPattern: 'none', // No permissions by default
            },
            {
                name: 'Editor',
                guard_name: 'web',
                description: 'Can create and edit content',
                permissionPattern: 'none', // No permissions by default
            },
            {
                name: 'Viewer',
                guard_name: 'web',
                description: 'Read-only access to the system',
                permissionPattern: 'view', // All view permissions
            },
        ];

        for (const roleData of rolesData) {
            const { permissionPattern, ...roleInfo } = roleData;
            const roleInfoWithAdminId = { ...roleInfo, admin_id: adminId };

            let role = await roleRepository.findOne({
                where: { name: roleData.name },
            });

            if (role) {
                // Update existing role
                await roleRepository.update(role.id, roleInfoWithAdminId);
                console.log(`  ✓ Updated role: ${roleData.name}`);
            } else {
                // Create new role
                role = await roleRepository.save(roleInfoWithAdminId);
                console.log(`  ✓ Created role: ${roleData.name}`);
            }

            // Attach permissions based on pattern
            if (role && permissionPattern !== 'none') {
                let permissionsToAttach: any[] = [];

                if (permissionPattern === 'all') {
                    // Attach all permissions
                    permissionsToAttach = await permissionRepository.find();
                } else if (permissionPattern === 'view') {
                    // Attach only view permissions
                    permissionsToAttach = await permissionRepository
                        .createQueryBuilder('permission')
                        .where('permission.name LIKE :pattern', { pattern: '%.view' })
                        .getMany();
                }

                // Clear existing permissions first
                await rolePermissionRepository.delete({ role_id: role.id });

                // Add new permissions
                for (const permission of permissionsToAttach) {
                    const rolePermission = rolePermissionRepository.create({
                        role_id: role.id,
                        permission_id: permission.id,
                    });
                    await rolePermissionRepository.save(rolePermission);
                }

                console.log(`  ✓ Attached ${permissionsToAttach.length} permissions to ${roleData.name}`);
            }
        }

        console.log('✅ Roles seeded successfully\n');
    } catch (error) {
        console.error('❌ Error seeding roles:', error.message);
        throw error;
    }
}
