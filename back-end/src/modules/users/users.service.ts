import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { generateUsername } from '../../common/utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * Find all users with pagination and filters (excluding soft-deleted)
     */
    async findAll(
        page = 1,
        perPage = 15,
        filters?: {
            search?: string;
            email?: string;
            phone?: string;
            country_id?: number;
            username?: string;
            first_name?: string;
            last_name?: string;
            from_date?: string;
            to_date?: string;
        },
        order: 'ASC' | 'DESC' = 'DESC',
    ) {
        const queryBuilder = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.country', 'country')
            .where('user.deleted_at IS NULL');

        // Apply filters
        if (filters?.search) {
            queryBuilder.andWhere(
                '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        if (filters?.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${filters.email}%`,
            });
        }

        if (filters?.phone) {
            queryBuilder.andWhere('user.phone LIKE :phone', {
                phone: `%${filters.phone}%`,
            });
        }

        if (filters?.country_id) {
            queryBuilder.andWhere('user.country_id = :country_id', {
                country_id: filters.country_id,
            });
        }

        if (filters?.username) {
            queryBuilder.andWhere('user.username LIKE :username', {
                username: `%${filters.username}%`,
            });
        }

        if (filters?.first_name) {
            queryBuilder.andWhere('user.first_name LIKE :first_name', {
                first_name: `%${filters.first_name}%`,
            });
        }

        if (filters?.last_name) {
            queryBuilder.andWhere('user.last_name LIKE :last_name', {
                last_name: `%${filters.last_name}%`,
            });
        }

        if (filters?.from_date) {
            queryBuilder.andWhere('user.created_at >= :from_date', {
                from_date: filters.from_date,
            });
        }

        if (filters?.to_date) {
            queryBuilder.andWhere('user.created_at <= :to_date', {
                to_date: filters.to_date,
            });
        }

        // Count total
        const total = await queryBuilder.getCount();

        // Apply pagination and ordering
        const data = await queryBuilder
            .orderBy('user.created_at', order)
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();

        // Remove password from response
        const sanitizedData = data.map(user => {
            const userWithoutPassword = { ...user } as Record<string, any>;
            delete userWithoutPassword.password;
            return userWithoutPassword;
        });

        return {
            data: sanitizedData,
            page,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        };
    }

    /**
     * Find all deleted users with pagination and filters
     */
    async findDeleted(
        page = 1,
        perPage = 15,
        filters?: {
            search?: string;
            email?: string;
            phone?: string;
            username?: string;
            first_name?: string;
            last_name?: string;
            from_date?: string;
            to_date?: string;
        },
        order: 'ASC' | 'DESC' = 'DESC',
    ) {
        const queryBuilder = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.country', 'country')
            .where('user.deleted_at IS NOT NULL')
            .withDeleted();

        if (filters?.search) {
            queryBuilder.andWhere(
                '(user.first_name LIKE :search OR user.last_name LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        if (filters?.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${filters.email}%`,
            });
        }

        if (filters?.phone) {
            queryBuilder.andWhere('user.phone LIKE :phone', {
                phone: `%${filters.phone}%`,
            });
        }

        if (filters?.username) {
            queryBuilder.andWhere('user.username LIKE :username', {
                username: `%${filters.username}%`,
            });
        }

        if (filters?.first_name) {
            queryBuilder.andWhere('user.first_name LIKE :first_name', {
                first_name: `%${filters.first_name}%`,
            });
        }

        if (filters?.last_name) {
            queryBuilder.andWhere('user.last_name LIKE :last_name', {
                last_name: `%${filters.last_name}%`,
            });
        }

        if (filters?.from_date) {
            queryBuilder.andWhere('user.created_at >= :from_date', {
                from_date: filters.from_date,
            });
        }

        if (filters?.to_date) {
            queryBuilder.andWhere('user.created_at <= :to_date', {
                to_date: filters.to_date,
            });
        }

        const total = await queryBuilder.getCount();

        const data = await queryBuilder
            .orderBy('user.deleted_at', order)
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();

        // Remove password from response
        const sanitizedData = data.map(user => {
            const userWithoutPassword = { ...user } as Record<string, any>;
            delete userWithoutPassword.password;
            return userWithoutPassword;
        });

        return {
            data: sanitizedData,
            page,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        };
    }

    /**
     * Get statistics about users
     */
    async getStatistics() {
        // Current counts (excluding soft-deleted)
        const total = await this.usersRepository.count();

        const deleted = await this.usersRepository.count({
            where: { deleted_at: Not(IsNull()) },
            withDeleted: true,
        });

        const verified = await this.usersRepository.count({
            where: { email_verified_at: Not(IsNull()) },
        });

        const unverified = await this.usersRepository.count({
            where: { email_verified_at: IsNull() },
        });

        return {
            total,
            deleted,
            verified,
            unverified,
        };
    }

    /**
     * Get monthly registration trend for the last N months (defaults to 6)
     */
    async getRegistrationTrend(months = 6) {
        const safeMonths = Math.min(Math.max(Math.floor(months) || 6, 1), 24);
        const now = new Date();
        const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (safeMonths - 1), 1));

        const rows = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.created_at', 'createdAt')
            .where('user.created_at >= :startDate', { startDate })
            .andWhere('user.deleted_at IS NULL')
            .getRawMany<{ createdAt: Date }>();

        const counts = new Map<string, number>();
        for (const row of rows) {
            const created = row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt);
            if (Number.isNaN(created.getTime())) {
                continue;
            }
            const key = `${created.getUTCFullYear()}-${String(created.getUTCMonth() + 1).padStart(2, '0')}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        const trend: Array<{ key: string; label: string; count: number }> = [];
        for (let offset = safeMonths - 1; offset >= 0; offset--) {
            const current = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
            const key = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}`;
            const label = current.toLocaleString('en-US', {
                month: 'short',
                year: 'numeric',
            });

            trend.push({
                key,
                label,
                count: counts.get(key) ?? 0,
            });
        }

        return trend;
    }

    /**
     * Get daily registration trend for the last N days (defaults to 7, max 90)
     */
    async getDailyRegistrationTrend(days = 7) {
        const safeDays = Math.min(Math.max(Math.floor(days) || 7, 1), 90);
        const now = new Date();
        const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (safeDays - 1), 0, 0, 0));

        const rows = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.created_at', 'createdAt')
            .where('user.created_at >= :startDate', { startDate })
            .andWhere('user.deleted_at IS NULL')
            .getRawMany<{ createdAt: Date }>();

        const counts = new Map<string, number>();
        for (const row of rows) {
            const created = row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt);
            if (Number.isNaN(created.getTime())) {
                continue;
            }
            const key = `${created.getUTCFullYear()}-${String(created.getUTCMonth() + 1).padStart(2, '0')}-${String(created.getUTCDate()).padStart(2, '0')}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        const trend: Array<{ key: string; label: string; count: number }> = [];
        for (let offset = safeDays - 1; offset >= 0; offset--) {
            const current = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset, 0, 0, 0));
            const key = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}-${String(current.getUTCDate()).padStart(2, '0')}`;
            const label = current.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
            });

            trend.push({
                key,
                label,
                count: counts.get(key) ?? 0,
            });
        }

        return trend;
    }

    /**
     * Find one user by username
     */
    async findByUsername(username: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
            relations: ['country'],
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        const userWithoutPassword = { ...user } as Record<string, any>;
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }

    /**
     * Find one deleted user by username
     */
    async findDeletedByUsername(username: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
            relations: ['country'],
            withDeleted: true,
        });

        if (!user || !user.deleted_at) {
            throw new NotFoundException(`Deleted user with username ${username} not found`);
        }

        const userWithoutPassword = { ...user } as Record<string, any>;
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }

    /**
     * Create a new user
     */
    async create(createUserDto: CreateUserDto, adminId?: number) {
        // Auto-generate username if not provided
        let username = createUserDto.username;
        if (!username) {
            username = await generateUsername(
                createUserDto.first_name,
                createUserDto.last_name,
                this.usersRepository
            );
        } else {
            // Check if username already exists
            const existingUsername = await this.usersRepository.findOne({
                where: { username },
            });
            if (existingUsername) {
                throw new ConflictException('Username already exists');
            }
        }

        // Check if email already exists
        const existingEmail = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.usersRepository.create({
            ...createUserDto,
            username,
            password: hashedPassword,
            admin_id: adminId,
        });

        const savedUser = await this.usersRepository.save(user);
        const userWithoutPassword = { ...savedUser } as Record<string, any>;
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }

    /**
     * Update a user
     */
    async update(username: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        // Check email uniqueness if changing email
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingEmail = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingEmail) {
                throw new ConflictException('Email already exists');
            }
        }

        // Hash password if provided
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        const updatedUser = await this.usersRepository.save(user);
        const userWithoutPassword = { ...updatedUser } as Record<string, any>;
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }

    /**
     * Change user password
     */
    async changePassword(username: string, newPassword: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.save(user);
    }

    /**
     * Mark email as verified
     */
    async markEmailVerified(username: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        user.email_verified_at = new Date();
        await this.usersRepository.save(user);
    }

    /**
     * Mark email as unverified
     */
    async markEmailUnverified(username: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        user.email_verified_at = null;
        await this.usersRepository.save(user);
    }

    /**
     * Soft delete a user
     */
    async delete(username: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        await this.usersRepository.softDelete(user.id);
    }

    /**
     * Restore a soft-deleted user
     */
    async restore(username: string) {
        const user = await this.usersRepository.findOne({
            where: { username },
            withDeleted: true,
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        if (!user.deleted_at) {
            throw new ConflictException('User is not deleted');
        }

        await this.usersRepository.restore(user.id);
    }

}
