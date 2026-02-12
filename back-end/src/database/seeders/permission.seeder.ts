import { DataSource } from 'typeorm';
import { Permission } from '../../modules/roles/entities/permission.entity';

/**
 * Permission Seeder
 * Organized by modules for easy management
 */
export class PermissionSeeder {
    /**
     * Predefined permissions organized by module
     */
    private static permissions = [
        // Admin Management Module
        {
            module: 'admins',
            permissions: [
                {
                    name: 'admins.view',
                    display_name: { ar: 'عرض المديرين', en: 'View Admins' },
                    description: { ar: 'عرض قائمة وتفاصيل المديرين', en: 'View admin list and details' }
                },
                {
                    name: 'admins.create',
                    display_name: { ar: 'إنشاء مدير', en: 'Create Admin' },
                    description: { ar: 'إنشاء مستخدمين مديرين جدد', en: 'Create new admin users' }
                },
                {
                    name: 'admins.edit',
                    display_name: { ar: 'تعديل مدير', en: 'Edit Admin' },
                    description: { ar: 'تعديل المستخدمين المديرين الموجودين', en: 'Edit existing admin users' }
                },
                {
                    name: 'admins.delete',
                    display_name: { ar: 'حذف مدير', en: 'Delete Admin' },
                    description: { ar: 'حذف المستخدمين المديرين', en: 'Delete admin users' }
                },
                {
                    name: 'admins.assign_roles',
                    display_name: { ar: 'تعيين الأدوار', en: 'Assign Roles' },
                    description: { ar: 'تعيين أدوار للمديرين', en: 'Assign roles to admins' }
                },
            ],
        },
        // Role Management Module
        {
            module: 'roles',
            permissions: [
                {
                    name: 'roles.view',
                    display_name: { ar: 'عرض الأدوار', en: 'View Roles' },
                    description: { ar: 'عرض قائمة وتفاصيل الأدوار', en: 'View roles list and details' }
                },
                {
                    name: 'roles.create',
                    display_name: { ar: 'إنشاء دور', en: 'Create Role' },
                    description: { ar: 'إنشاء أدوار جديدة', en: 'Create new roles' }
                },
                {
                    name: 'roles.edit',
                    display_name: { ar: 'تعديل دور', en: 'Edit Role' },
                    description: { ar: 'تعديل الأدوار الموجودة', en: 'Edit existing roles' }
                },
                {
                    name: 'roles.delete',
                    display_name: { ar: 'حذف دور', en: 'Delete Role' },
                    description: { ar: 'حذف الأدوار', en: 'Delete roles' }
                },
                {
                    name: 'roles.assign_permissions',
                    display_name: { ar: 'تعيين الصلاحيات', en: 'Assign Permissions' },
                    description: { ar: 'تعيين صلاحيات للأدوار', en: 'Assign permissions to roles' }
                },
            ],
        },
        // Settings Module
        {
            module: 'settings',
            permissions: [
                {
                    name: 'settings.view',
                    display_name: { ar: 'عرض الإعدادات', en: 'View Settings' },
                    description: { ar: 'عرض إعدادات التطبيق', en: 'View application settings' }
                },
                {
                    name: 'settings.edit',
                    display_name: { ar: 'تعديل الإعدادات', en: 'Edit Settings' },
                    description: { ar: 'تعديل إعدادات التطبيق', en: 'Edit application settings' }
                },
            ],
        },
        // Users Module
        {
            module: 'users',
            permissions: [
                {
                    name: 'users.view',
                    display_name: { ar: 'عرض المستخدمين', en: 'View Users' },
                    description: { ar: 'عرض قائمة المستخدمين', en: 'View user list' }
                },
                {
                    name: 'users.create',
                    display_name: { ar: 'إنشاء مستخدم', en: 'Create User' },
                    description: { ar: 'إنشاء مستخدمين جدد', en: 'Create new users' }
                },
                {
                    name: 'users.update',
                    display_name: { ar: 'تحديث مستخدم', en: 'Update User' },
                    description: { ar: 'تحديث المستخدمين الموجودين', en: 'Update existing users' }
                },
                {
                    name: 'users.delete',
                    display_name: { ar: 'حذف مستخدم', en: 'Delete User' },
                    description: { ar: 'حذف المستخدمين', en: 'Delete users' }
                },
                {
                    name: 'users.restore',
                    display_name: { ar: 'استعادة مستخدم', en: 'Restore User' },
                    description: { ar: 'استعادة المستخدمين المحذوفين', en: 'Restore deleted users' }
                },
                {
                    name: 'users.verify',
                    display_name: { ar: 'التحقق من المستخدم', en: 'Verify User' },
                    description: { ar: 'تفعيل أو إلغاء تفعيل حساب المستخدم', en: 'Verify or unverify user account' }
                },
            ],
        },
        // Projects Module
        {
            module: 'projects',
            permissions: [
                {
                    name: 'projects.view',
                    display_name: { ar: 'عرض المشاريع', en: 'View Projects' },
                    description: { ar: 'عرض قائمة وتفاصيل المشاريع', en: 'View projects list and details' }
                },
                {
                    name: 'projects.create',
                    display_name: { ar: 'إنشاء مشروع', en: 'Create Project' },
                    description: { ar: 'إنشاء مشاريع جديدة', en: 'Create new projects' }
                },
                {
                    name: 'projects.edit',
                    display_name: { ar: 'تعديل مشروع', en: 'Edit Project' },
                    description: { ar: 'تعديل المشاريع الموجودة', en: 'Edit existing projects' }
                },
                {
                    name: 'projects.delete',
                    display_name: { ar: 'حذف مشروع', en: 'Delete Project' },
                    description: { ar: 'حذف المشاريع', en: 'Delete projects' }
                },
                {
                    name: 'projects.restore',
                    display_name: { ar: 'استعادة مشروع', en: 'Restore Project' },
                    description: { ar: 'استعادة المشاريع المحذوفة', en: 'Restore deleted projects' }
                },
            ],
        },
        // AI Assistant Module
        {
            module: 'ai_chat',
            permissions: [
                {
                    name: 'ai_chat.use',
                    display_name: { ar: 'استخدام المساعد الذكي', en: 'Use AI Assistant' },
                    description: { ar: 'استخدام ميزة المساعد الذكي', en: 'Use AI assistant feature' }
                },
                {
                    name: 'ai_chat.view_models',
                    display_name: { ar: 'عرض نماذج الذكاء الاصطناعي', en: 'View AI Models' },
                    description: { ar: 'عرض النماذج المتاحة للذكاء الاصطناعي', en: 'View available AI models' }
                },
            ],
        },
    ];

    /**
     * Seed permissions into database
     */
    static async seed(dataSource: DataSource): Promise<void> {
        const permissionRepository = dataSource.getRepository(Permission);

        for (const moduleGroup of this.permissions) {
            for (const permData of moduleGroup.permissions) {
                // Check if permission already exists
                const existing = await permissionRepository.findOne({
                    where: { name: permData.name },
                });

                if (!existing) {
                    const permission = permissionRepository.create({
                        name: permData.name,
                        display_name: permData.display_name,
                        description: permData.description,
                        module: moduleGroup.module,
                        guard_name: 'web',
                    });

                    await permissionRepository.save(permission);
                } else {
                    // Update existing permission
                    existing.display_name = permData.display_name;
                    existing.description = permData.description;
                    existing.module = moduleGroup.module;
                    await permissionRepository.save(existing);
                }
            }
        }

        console.log('✅ Permission seeding completed');
    }

    /**
     * Get all permissions grouped by module
     */
    static getPermissions() {
        return this.permissions;
    }
}
