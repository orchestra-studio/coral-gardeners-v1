import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { AuthGateway } from '../auth/auth.gateway';
import { I18nService } from '../../i18n/i18n.service';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        @InjectRepository(RolePermission)
        private rolePermissionRepository: Repository<RolePermission>,
        @InjectDataSource()
        private dataSource: DataSource,
        @Inject(forwardRef(() => AuthGateway))
        private authGateway: AuthGateway,
        private readonly i18n: I18nService,
    ) { }

    /**
     * Find all roles with optional pagination and filters
     */
    async findAll(
        page?: number,
        pageCount?: number,
        name?: string,
        guardName?: string,
        createdFrom?: string,
        createdTo?: string
    ): Promise<any> {
        const queryBuilder = this.roleRepository.createQueryBuilder('role');

        // Apply name filter
        if (name) {
            queryBuilder.where('role.name LIKE :name', { name: `%${name}%` });
        }

        // Apply guard_name filter
        if (guardName) {
            queryBuilder.andWhere('role.guard_name = :guardName', { guardName });
        }

        // Apply created_from date filter
        if (createdFrom) {
            queryBuilder.andWhere('role.created_at >= :createdFrom', {
                createdFrom: new Date(createdFrom)
            });
        }

        // Apply created_to date filter
        if (createdTo) {
            // Add end of day to include the full day
            const endOfDay = new Date(createdTo);
            endOfDay.setHours(23, 59, 59, 999);
            queryBuilder.andWhere('role.created_at <= :createdTo', {
                createdTo: endOfDay
            });
        }

        // If pagination requested
        if (page && pageCount) {
            const skip = (page - 1) * pageCount;

            // Get total count
            const total = await queryBuilder.getCount();

            // Apply pagination
            queryBuilder
                .skip(skip)
                .take(pageCount)
                .orderBy('role.name', 'ASC');

            const roles = await queryBuilder.getMany();

            // Return paginated response
            return {
                data: roles,
                page,
                limit: pageCount,
                total,
                totalPages: Math.ceil(total / pageCount),
            };
        }

        // Return all roles without pagination
        queryBuilder.orderBy('role.name', 'ASC');
        return await queryBuilder.getMany();
    }

    /**
     * Get roles formatted for select dropdown
     */
    async getRolesForSelect(): Promise<Array<{ value: number; label: string }>> {
        const roles = await this.roleRepository.find({
            order: { name: 'ASC' },
        });

        return roles.map(role => ({
            value: role.id,
            label: role.name,
        }));
    }

    /**
     * Get all available permissions grouped by module
     */
    async getAllPermissions(): Promise<any> {
        const permissions = await this.permissionRepository.find({
            order: { module: 'ASC', name: 'ASC' },
        });

        // Group permissions by module
        const grouped = permissions.reduce((acc, permission) => {
            if (!acc[permission.module]) {
                acc[permission.module] = [];
            }
            acc[permission.module].push({
                name: permission.name,
                display_name: permission.display_name,
                description: permission.description,
            });
            return acc;
        }, {} as Record<string, any[]>);

        return grouped;
    }

    /**
     * Find roles by IDs
     */
    async findByIds(ids: number[]): Promise<Role[]> {
        if (!ids || ids.length === 0) {
            return [];
        }

        return this.roleRepository
            .createQueryBuilder('role')
            .whereInIds(ids)
            .getMany();
    }

    /**
     * Find one role by ID
     */
    async findOne(id: number, locale?: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });

        if (!role) {
            throw new NotFoundException(
                locale ? this.i18n.t('not_found', 'roles', locale) : 'Role not found'
            );
        }

        return role;
    }

    /**
     * Find one role by ID with permissions
     */
    async findOneWithPermissions(id: number): Promise<any> {
        const role = await this.findOne(id);

        // Get permissions for this role
        const rolePermissions = await this.rolePermissionRepository.find({
            where: { role_id: id },
        });

        const permissionIds = rolePermissions.map(rp => rp.permission_id);

        let permissions: string[] = [];
        if (permissionIds.length > 0) {
            const perms = await this.permissionRepository.find({
                where: { id: In(permissionIds) },
            });
            permissions = perms.map(p => p.name);
        }

        // Get count of admins with this role
        const adminsCount = await this.dataSource.query(
            'SELECT COUNT(*) as count FROM admin_role WHERE role_id = ?',
            [id]
        );

        return {
            ...role,
            permissions,
            users_count: adminsCount[0]?.count || 0,
        };
    }

    /**
     * Create a new role
     */
    async create(name: string, adminId?: number, locale?: string): Promise<Role> {
        // Check if role with same name exists
        const existing = await this.roleRepository.findOne({ where: { name } });
        if (existing) {
            throw new ConflictException(
                locale ? this.i18n.t('name_exists', 'roles', locale) : 'Role with this name already exists'
            );
        }

        const role = this.roleRepository.create({
            name,
            guard_name: 'web',
            admin_id: adminId,
        });

        return await this.roleRepository.save(role);
    }

    /**
     * Update role name
     */
    async update(id: number, name: string, locale?: string): Promise<Role> {
        const role = await this.findOne(id, locale);

        // Check if another role has the same name
        const existing = await this.roleRepository.findOne({
            where: { name }
        });

        if (existing && existing.id !== id) {
            throw new ConflictException(
                locale ? this.i18n.t('name_exists', 'roles', locale) : 'Role with this name already exists'
            );
        }

        role.name = name;
        return await this.roleRepository.save(role);
    }

    /**
     * Update role permissions
     */
    async updatePermissions(roleId: number, permissionNames: string[], locale?: string): Promise<any> {
        await this.findOne(roleId, locale);

        // Get permission IDs from names
        let permissionIds: number[] = [];
        if (permissionNames.length > 0) {
            const permissions = await this.permissionRepository.find({
                where: { name: In(permissionNames) },
            });
            permissionIds = permissions.map(p => p.id);
        }

        // Delete existing role permissions
        await this.rolePermissionRepository.delete({ role_id: roleId });

        // Insert new permissions
        if (permissionIds.length > 0) {
            const rolePermissions = permissionIds.map(permissionId =>
                this.rolePermissionRepository.create({
                    role_id: roleId,
                    permission_id: permissionId,
                })
            );
            await this.rolePermissionRepository.save(rolePermissions);
        }

        // Get all admins with this role and notify them via WebSocket
        const adminsWithRole = await this.dataSource.query(
            'SELECT admin_id FROM admin_role WHERE role_id = ?',
            [roleId]
        );

        if (adminsWithRole.length > 0) {
            const adminIds = adminsWithRole.map(row => row.admin_id);
            this.authGateway.emitPermissionUpdateToAdmins(adminIds);
        }

        return await this.findOneWithPermissions(roleId);
    }    /**
     * Get statistics about roles
     */
    async getStatistics() {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Current counts
        const total = await this.roleRepository.count();

        // Count roles with assigned admins
        const rolesWithAdmins = await this.dataSource.query(`
            SELECT COUNT(DISTINCT role_id) as count 
            FROM admin_role
        `);
        const withAdmins = rolesWithAdmins[0]?.count || 0;

        // Count roles without any admins
        const withoutAdmins = total - withAdmins;

        // Count recently created roles (last 7 days)
        const recentlyAdded = await this.roleRepository
            .createQueryBuilder('role')
            .where('role.created_at >= :sevenDaysAgo', { sevenDaysAgo })
            .getCount();

        // Count recently updated roles (last 7 days)
        const recentlyUpdated = await this.roleRepository
            .createQueryBuilder('role')
            .where('role.updated_at >= :sevenDaysAgo', { sevenDaysAgo })
            .andWhere('role.updated_at != role.created_at')
            .getCount();

        return {
            total,
            withAdmins,
            withoutAdmins,
            recentlyAdded,
            recentlyUpdated,
        };
    }

    /**
     * Delete a role
     */
    async remove(id: number, locale?: string): Promise<void> {
        const role = await this.findOne(id, locale);

        // Check if role is assigned to any admins
        const usersCount = await this.dataSource.query(
            'SELECT COUNT(*) as count FROM admin_role WHERE role_id = ?',
            [id]
        );

        if (usersCount[0].count > 0) {
            throw new BadRequestException(
                locale ? this.i18n.t('in_use', 'roles', locale) : 'Cannot delete role that is assigned to users'
            );
        }

        // Delete role
        await this.roleRepository.remove(role);
    }
}
