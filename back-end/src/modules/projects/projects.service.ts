import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    /**
     * Create a new project
     */
    async create(createProjectDto: CreateProjectDto, adminId?: number): Promise<Project> {
        const project = this.projectsRepository.create({
            ...createProjectDto,
            admin_id: adminId,
        });
        return await this.projectsRepository.save(project);
    }

    /**
     * Get all projects with pagination and optional filters
     */
    async findAll(
        page: number = 1,
        perPage: number = 10,
        filters?: { name?: string; status?: string; environment?: string },
    ) {
        const queryBuilder = this.projectsRepository
            .createQueryBuilder('project')
            .where('project.deleted_at IS NULL');

        // Apply filters - search in JSON translations
        if (filters?.name) {
            queryBuilder.andWhere(
                "(JSON_EXTRACT(project.translations, '$.en.name') LIKE :name OR JSON_EXTRACT(project.translations, '$.ar.name') LIKE :name)",
                { name: `%${filters.name}%` },
            );
        }

        if (filters?.status) {
            queryBuilder.andWhere('project.status = :status', {
                status: filters.status,
            });
        }

        if (filters?.environment) {
            queryBuilder.andWhere(
                "(JSON_EXTRACT(project.translations, '$.en.environment') LIKE :environment OR JSON_EXTRACT(project.translations, '$.ar.environment') LIKE :environment)",
                { environment: `%${filters.environment}%` },
            );
        }

        // Count total
        const total = await queryBuilder.getCount();

        // Apply pagination and ordering
        const data = await queryBuilder
            .orderBy('project.updated_at', 'DESC')
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();

        return {
            data,
            page,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        };
    }

    /**
     * Get a single project by ID
     */
    async findOne(id: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id },
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        return project;
    }

    /**
     * Update a project
     */
    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = await this.findOne(id);

        Object.assign(project, updateProjectDto);

        return await this.projectsRepository.save(project);
    }

    /**
     * Soft delete a project
     */
    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.projectsRepository.softDelete(id);
    }

    /**
     * Get recent projects (for dashboard)
     */
    async getRecent(limit: number = 5): Promise<Project[]> {
        const queryBuilder = this.projectsRepository
            .createQueryBuilder('project')
            .where('project.deleted_at IS NULL')
            .orderBy('project.updated_at', 'DESC')
            .take(limit);

        return await queryBuilder.getMany();
    }

    /**
     * Get all deleted projects with pagination
     */
    async findDeleted(
        page: number = 1,
        perPage: number = 10,
        filters?: { name?: string },
    ) {
        const queryBuilder = this.projectsRepository
            .createQueryBuilder('project')
            .where('project.deleted_at IS NOT NULL')
            .withDeleted();

        // Apply filters - search in JSON translations
        if (filters?.name) {
            queryBuilder.andWhere(
                "(JSON_EXTRACT(project.translations, '$.en.name') LIKE :name OR JSON_EXTRACT(project.translations, '$.ar.name') LIKE :name)",
                { name: `%${filters.name}%` },
            );
        }

        // Count total
        const total = await queryBuilder.getCount();

        // Apply pagination and ordering
        const data = await queryBuilder
            .orderBy('project.deleted_at', 'DESC')
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();

        return {
            data,
            page,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        };
    }

    /**
     * Restore a soft-deleted project
     */
    async restore(id: number): Promise<void> {
        // First check if project exists (even if deleted)
        const project = await this.projectsRepository
            .createQueryBuilder('project')
            .where('project.id = :id', { id })
            .withDeleted()
            .getOne();

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        if (!project.deleted_at) {
            throw new NotFoundException(`Project with ID ${id} is not deleted`);
        }

        await this.projectsRepository.restore(id);
    }

    /**
     * Get statistics about projects
     */
    async getStatistics() {
        // Current counts (excluding soft-deleted)
        const total = await this.projectsRepository.count();

        const deleted = await this.projectsRepository.count({
            where: { deleted_at: Not(IsNull()) },
            withDeleted: true,
        });

        const inProgress = await this.projectsRepository.count({
            where: { status: 'in-progress' },
        });

        const ready = await this.projectsRepository.count({
            where: { status: 'ready' },
        });

        const blocked = await this.projectsRepository.count({
            where: { status: 'blocked' },
        });

        return {
            total,
            deleted,
            inProgress,
            ready,
            blocked,
        };
    }
}
