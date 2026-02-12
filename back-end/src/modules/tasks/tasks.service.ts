import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { I18nService } from '../../i18n/i18n.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private readonly i18n: I18nService,
    ) { }

    /**
     * Get all tasks for a specific admin with pagination
     * @param adminId - The ID of the admin
     * @param page - Page number (default: 1)
     * @param perPage - Items per page (default: 10)
     * @param status - Filter by status: 'active', 'completed', or 'all' (default: 'all')
     */
    async findAll(
        adminId: number,
        page: number = 1,
        perPage: number = 10,
        status: string = 'all',
    ) {
        const queryBuilder = this.tasksRepository
            .createQueryBuilder('task')
            .where('task.adminId = :adminId', { adminId });

        // Apply status filter
        if (status === 'active') {
            queryBuilder.andWhere('task.completed = :completed', { completed: false });
        } else if (status === 'completed') {
            queryBuilder.andWhere('task.completed = :completed', { completed: true });
        }
        // If status is 'all', no additional filter is applied

        // Count total
        const total = await queryBuilder.getCount();

        // Apply pagination and ordering
        const data = await queryBuilder
            .orderBy('task.createdAt', 'DESC')
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
     * Get tasks with history (all tasks including completed)
     */
    async findAllWithHistory(adminId: number): Promise<{
        active: Task[];
        completed: Task[];
        total: number;
    }> {
        // Get all tasks without pagination for history view
        const allTasks = await this.tasksRepository.find({
            where: { adminId },
            order: { createdAt: 'DESC' },
        });

        const active = allTasks.filter(task => !task.completed);
        const completed = allTasks.filter(task => task.completed);

        return {
            active,
            completed,
            total: allTasks.length,
        };
    }

    /**
     * Get a single task by ID
     */
    async findOne(id: number, adminId: number, locale?: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id, adminId },
        });

        if (!task) {
            throw new NotFoundException(
                this.i18n.t('not_found', 'tasks', locale || 'en')
            );
        }

        return task;
    }

    /**
     * Create a new task
     */
    async create(createTaskDto: CreateTaskDto, adminId: number): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            adminId,
            completed: createTaskDto.completed || false,
        });

        return await this.tasksRepository.save(task);
    }

    /**
     * Update a task
     */
    async update(id: number, updateTaskDto: UpdateTaskDto, adminId: number, locale?: string): Promise<Task> {
        const task = await this.findOne(id, adminId, locale);

        Object.assign(task, updateTaskDto);

        return await this.tasksRepository.save(task);
    }

    /**
     * Toggle task completion status
     */
    async toggleComplete(id: number, adminId: number, locale?: string): Promise<Task> {
        const task = await this.findOne(id, adminId, locale);

        task.completed = !task.completed;

        return await this.tasksRepository.save(task);
    }

    /**
     * Delete a task
     */
    async remove(id: number, adminId: number, locale?: string): Promise<void> {
        const task = await this.findOne(id, adminId, locale);

        await this.tasksRepository.remove(task);
    }

    /**
     * Get task statistics for an admin
     */
    async getStats(adminId: number): Promise<{
        total: number;
        completed: number;
        active: number;
        completionRate: number;
    }> {
        // Get all tasks without pagination for stats
        const tasks = await this.tasksRepository.find({
            where: { adminId },
        });

        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const active = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            active,
            completionRate,
        };
    }
}
