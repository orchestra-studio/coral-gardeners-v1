import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { Role } from '../roles/role.entity';
import { Country } from '../helpers/countries/country.entity';
import { AdminRole } from './entities/admin-role.entity';
import { Permission } from '../roles/entities/permission.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { CreateAdminDto, UpdateAdminDto, UpdateAdminRolesDto } from './dto/admin.dto';
import { AuthGateway } from '../auth/auth.gateway';
import * as bcrypt from 'bcrypt';
import { generateUsername } from '../../common/utils';
import { I18nService } from '../../i18n/i18n.service';

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
        @InjectRepository(AdminRole)
        private adminRoleRepository: Repository<AdminRole>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        @InjectRepository(RolePermission)
        private rolePermissionRepository: Repository<RolePermission>,
        private readonly i18n: I18nService,
        private readonly authGateway: AuthGateway,
    ) { }

    /**
     * Create a new admin
     */
    async create(createAdminDto: CreateAdminDto): Promise<Admin> {
        // Validate password confirmation
        if (createAdminDto.password !== createAdminDto.password_confirmation) {
            throw new BadRequestException('Password confirmation does not match');
        }

        // Check if email already exists
        const existingAdmin = await this.adminRepository.findOne({
            where: { email: createAdminDto.email },
        });

        if (existingAdmin) {
            throw new ConflictException('Admin with this email already exists');
        }

        // Generate unique username
        const username = await generateUsername(
            createAdminDto.first_name,
            createAdminDto.last_name,
            this.adminRepository
        );

        // Create admin
        const admin = this.adminRepository.create({
            username,
            first_name: createAdminDto.first_name,
            last_name: createAdminDto.last_name,
            email: createAdminDto.email,
            password: createAdminDto.password,
            phone: createAdminDto.phone || null,
            profile_picture: createAdminDto.profile_picture || null,
            country_id: createAdminDto.country_id || null,
        });

        const savedAdmin = await this.adminRepository.save(admin);

        // Remove password from response
        delete savedAdmin.password;
        return savedAdmin;
    }

    /**
     * Find all admins with pagination
     */
    async findAll(
        page = 1,
        perPage = 10,
        filters: any = {},
    ): Promise<PaginatedResponse<any>> {
        const whereConditions: any[] = [];

        // Add filters
        if (filters.email) {
            whereConditions.push({ email: Like(`%${filters.email}%`) });
        }
        if (filters.phone) {
            whereConditions.push({ phone: Like(`%${filters.phone}%`) });
        }
        if (filters.name) {
            // Search in first_name, last_name, or username
            whereConditions.push([
                { first_name: Like(`%${filters.name}%`) },
                { last_name: Like(`%${filters.name}%`) },
                { username: Like(`%${filters.name}%`) },
            ]);
        }

        // If no filters, use empty object; if filters exist, use OR condition
        const whereCondition = whereConditions.length > 0
            ? whereConditions.flat()
            : {};

        const [admins, total] = await this.adminRepository.findAndCount({
            where: whereCondition,
            take: perPage,
            skip: (page - 1) * perPage,
            order: { created_at: 'DESC' },
        });

        // Fetch roles and country for each admin
        const adminsWithRelations = await Promise.all(
            admins.map(async (admin) => {
                const roles = await this.getAdminRoles(admin.id);
                const country = admin.country_id
                    ? await this.countryRepository.findOne({ where: { id: admin.country_id } })
                    : null;

                const adminData = { ...admin } as Record<string, any>;
                delete adminData.password;

                return {
                    ...adminData,
                    full_name: `${admin.first_name} ${admin.last_name}`,
                    phone_number: admin.phone,
                    profile_image: admin.profile_picture,
                    roles,
                    country,
                };
            }),
        );

        return {
            data: adminsWithRelations,
            page,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        };
    }

    /**
     * Find one admin by ID
     */
    async findOne(id: number): Promise<any> {
        const admin = await this.adminRepository.findOne({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        const roles = await this.getAdminRoles(admin.id);
        const country = admin.country_id
            ? await this.countryRepository.findOne({ where: { id: admin.country_id } })
            : null;

        const adminData = { ...admin } as Record<string, any>;
        delete adminData.password;

        return {
            ...adminData,
            full_name: `${admin.first_name} ${admin.last_name}`,
            roles,
            country,
        };
    }

    /**
     * Find admin by email
     */
    async findByEmail(email: string): Promise<Admin | null> {
        return this.adminRepository.findOne({
            where: { email },
        });
    }

    /**
     * Find admin by username
     */
    async findByUsername(username: string): Promise<any> {
        const admin = await this.adminRepository.findOne({
            where: { username },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        const roles = await this.getAdminRoles(admin.id);
        const country = admin.country_id
            ? await this.countryRepository.findOne({ where: { id: admin.country_id } })
            : null;

        const adminData = { ...admin } as Record<string, any>;
        delete adminData.password;

        return {
            ...adminData,
            full_name: `${admin.first_name} ${admin.last_name}`,
            roles,
            country,
        };
    }

    /**
     * Update admin
     */
    async update(
        id: number,
        updateAdminDto: UpdateAdminDto,
    ): Promise<any> {
        const admin = await this.adminRepository.findOne({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        // Validate password confirmation if password is being updated
        if (updateAdminDto.password && updateAdminDto.password_confirmation) {
            if (updateAdminDto.password !== updateAdminDto.password_confirmation) {
                throw new BadRequestException('Password confirmation does not match');
            }
            // Hash password
            updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
        } else if (updateAdminDto.password) {
            // Hash password if provided without confirmation
            updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
        }

        // Remove password_confirmation from update data
        const updateData = { ...(updateAdminDto as any) };
        delete updateData.password_confirmation;

        Object.assign(admin, updateData);
        const savedAdmin = await this.adminRepository.save(admin);

        const result = { ...savedAdmin } as Record<string, any>;
        delete result.password;
        return result;
    }

    /**
     * Update admin roles
     */
    async updateRoles(id: number, updateRolesDto: UpdateAdminRolesDto): Promise<void> {
        // Check if admin exists
        const admin = await this.findOne(id);
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        // Delete existing roles
        await this.adminRoleRepository.delete({ admin_id: id });

        // Add new roles
        for (const roleId of updateRolesDto.role_ids) {
            const adminRole = this.adminRoleRepository.create({
                admin_id: id,
                role_id: roleId,
            });
            await this.adminRoleRepository.save(adminRole);
        }

        // Emit WebSocket event to notify the admin of permission changes
        this.authGateway.emitPermissionUpdate(id);
    }

    /**
     * Delete admin
     */
    async remove(id: number): Promise<void> {
        const admin = await this.adminRepository.findOne({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        await this.adminRepository.softRemove(admin);
    }

    /**
     * Validate admin credentials
     */
    async validateAdmin(email: string, password: string): Promise<Admin | null> {
        const admin = await this.findByEmail(email);

        if (!admin) {
            return null;
        }

        const isPasswordValid = await admin.validatePassword(password);

        if (!isPasswordValid) {
            return null;
        }

        return admin;
    }

    /**
     * Get admin roles
     */
    private async getAdminRoles(adminId: number): Promise<Role[]> {
        const adminRoles = await this.adminRoleRepository.find({
            where: { admin_id: adminId },
        });

        const roleIds = adminRoles.map((ar) => ar.role_id);
        if (roleIds.length === 0) return [];

        return this.roleRepository.findByIds(roleIds);
    }

    /**
     * Get admin roles with their permissions
     */
    async getAdminRolesWithPermissions(adminId: number): Promise<any[]> {
        const roles = await this.getAdminRoles(adminId);

        const rolesWithPermissions = await Promise.all(
            roles.map(async (role) => {
                // Get role permissions from role_permissions table
                const rolePermissions = await this.rolePermissionRepository.find({
                    where: { role_id: role.id },
                });

                const permissionIds = rolePermissions.map(rp => rp.permission_id);

                let permissions: string[] = [];
                if (permissionIds.length > 0) {
                    const perms = await this.permissionRepository.find({
                        where: { id: In(permissionIds) },
                    });
                    permissions = perms.map(p => p.name);
                }

                return {
                    id: role.id,
                    name: role.name,
                    guard_name: role.guard_name,
                    description: role.description,
                    permissions,
                };
            })
        );

        return rolesWithPermissions;
    }

    /**
     * Update current admin's profile
     */
    async updateProfile(adminId: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        // Check if email is being changed and if it already exists
        if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
            const existingAdmin = await this.adminRepository.findOne({
                where: { email: updateAdminDto.email },
            });

            if (existingAdmin) {
                throw new ConflictException('Email already in use');
            }
        }

        // Update fields (excluding password)
        if (updateAdminDto.first_name !== undefined) {
            admin.first_name = updateAdminDto.first_name;
        }
        if (updateAdminDto.last_name !== undefined) {
            admin.last_name = updateAdminDto.last_name;
        }
        if (updateAdminDto.email !== undefined) {
            admin.email = updateAdminDto.email;
        }
        if (updateAdminDto.phone !== undefined) {
            admin.phone = updateAdminDto.phone;
        }
        if (updateAdminDto.profile_picture !== undefined) {
            admin.profile_picture = updateAdminDto.profile_picture;
        }
        if (updateAdminDto.country_id !== undefined) {
            admin.country_id = updateAdminDto.country_id;
        }

        const updatedAdmin = await this.adminRepository.save(admin);

        // Remove password from response
        delete updatedAdmin.password;
        return updatedAdmin;
    }

    /**
     * Change admin password
     */
    async changePassword(
        adminId: number,
        passwordData: { current_password: string; password: string; password_confirmation: string },
        locale?: string,
    ): Promise<void> {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException(
                locale ? this.i18n.t('not_found', 'admin', locale) : 'Admin not found'
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(passwordData.current_password, admin.password);
        if (!isPasswordValid) {
            throw new BadRequestException(
                locale ? this.i18n.t('incorrect_current_password', 'admin', locale) : 'Current password is incorrect'
            );
        }

        // Validate password confirmation
        if (passwordData.password !== passwordData.password_confirmation) {
            throw new BadRequestException(
                locale ? this.i18n.t('password_mismatch', 'admin', locale) : 'Password confirmation does not match'
            );
        }

        // Hash new password
        admin.password = await bcrypt.hash(passwordData.password, 10);
        await this.adminRepository.save(admin);
    }

    /**
     * Get admin statistics
     */
    async getStatistics(): Promise<any> {
        // Get total count
        const total = await this.adminRepository.count();

        // Get admins with roles count
        const adminRolesCount = await this.adminRoleRepository
            .createQueryBuilder('admin_role')
            .select('COUNT(DISTINCT admin_role.admin_id)', 'count')
            .getRawOne();

        const adminsWithRoles = parseInt(adminRolesCount.count) || 0;

        // Get recently added (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentlyAddedCount = await this.adminRepository
            .createQueryBuilder('admin')
            .where('admin.created_at >= :date', { date: sevenDaysAgo })
            .getCount();

        // Get recently updated (last 7 days)
        const recentlyUpdatedCount = await this.adminRepository
            .createQueryBuilder('admin')
            .where('admin.updated_at >= :date', { date: sevenDaysAgo })
            .getCount();

        return {
            total,
            adminsWithRoles,
            recentlyAdded: recentlyAddedCount,
            recentlyUpdated: recentlyUpdatedCount,
        };
    }
}
