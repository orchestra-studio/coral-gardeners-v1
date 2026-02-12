import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';
import {
    CreateSessionDto,
    UpdateSessionDto,
    SaveMessagesDto,
    ListSessionsDto,
    ListMessagesDto,
} from './dto';

@Injectable()
export class ChatSessionsService {
    constructor(
        @InjectRepository(ChatSession)
        private readonly sessionRepository: Repository<ChatSession>,
        @InjectRepository(ChatMessage)
        private readonly messageRepository: Repository<ChatMessage>,
    ) { }

    /**
     * Create a new chat session
     */
    async create(
        dto: CreateSessionDto,
        adminId?: number,
    ): Promise<ChatSession> {
        const session = this.sessionRepository.create({
            title: dto.title || 'New Chat',
            model: dto.model,
            provider: dto.provider,
            adminId,
            messagesCount: 0,
        });

        return this.sessionRepository.save(session);
    }

    /**
     * List all sessions for a user with pagination and filters
     */
    async findAll(adminId?: number, query?: ListSessionsDto) {
        const { page = 1, limit = 20, search, archived } = query || {};
        const skip = (page - 1) * limit;

        const queryBuilder = this.sessionRepository
            .createQueryBuilder('session')
            .orderBy('session.updatedAt', 'DESC')
            .skip(skip)
            .take(limit);

        if (adminId) {
            queryBuilder.andWhere('session.adminId = :adminId', { adminId });
        }

        if (search) {
            queryBuilder.andWhere('session.title LIKE :search', {
                search: `%${search}%`,
            });
        }

        if (archived !== undefined && archived !== null) {
            // Convert to number for MySQL TINYINT comparison
            // TypeORM with MySQL stores boolean as TINYINT(1)
            const archivedValue = archived ? 1 : 0;
            queryBuilder.andWhere('session.isArchived = :archived', {
                archived: archivedValue
            });
        }

        const [sessions, total] = await queryBuilder.getManyAndCount();

        return {
            data: sessions,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get a single session with all its messages
     * Also updates the session's updatedAt to move it to the top of the list
     */
    async findOne(id: number, adminId?: number): Promise<ChatSession> {
        const session = await this.sessionRepository.findOne({
            where: { id },
        });

        if (!session) {
            throw new NotFoundException(`Chat session with ID ${id} not found`);
        }

        if (adminId && session.adminId !== adminId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        // Update the session's updatedAt to move it to the top of the list
        session.updatedAt = new Date();
        await this.sessionRepository.save(session);

        // Ensure the update is committed to database before returning
        // This prevents race conditions where the list is fetched before the update is visible
        await this.sessionRepository.manager.query(
            'SELECT updated_at FROM chat_sessions WHERE id = ?',
            [id]
        );

        return session;
    }

    /**
     * Get paginated messages for a session
     * Returns messages in descending order (newest first) for proper pagination
     */
    async getMessages(
        sessionId: number,
        query: ListMessagesDto,
        adminId?: number,
    ) {
        // Verify session exists and user has access
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundException(`Chat session with ID ${sessionId} not found`);
        }

        if (adminId && session.adminId !== adminId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        const { page = 1, limit = 20, before } = query;
        const skip = (page - 1) * limit;

        // Build query
        const queryBuilder = this.messageRepository
            .createQueryBuilder('message')
            .where('message.sessionId = :sessionId', { sessionId })
            .orderBy('message.createdAt', 'DESC') // Newest first for pagination
            .skip(skip)
            .take(limit);

        // Cursor-based pagination support (optional, for infinite scroll)
        if (before) {
            queryBuilder.andWhere('message.id < :before', { before: parseInt(before, 10) });
        }

        const [messages, total] = await queryBuilder.getManyAndCount();

        // Keep messages in DESC order (newest first) for proper pagination
        // Frontend will handle display order
        return {
            data: messages,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + messages.length < total,
        };
    }

    /**
     * Update session (rename or archive)
     */
    async update(
        id: number,
        dto: UpdateSessionDto,
        adminId?: number,
    ): Promise<ChatSession> {
        const session = await this.sessionRepository.findOne({ where: { id } });

        if (!session) {
            throw new NotFoundException(`Chat session with ID ${id} not found`);
        }

        if (adminId && session.adminId !== adminId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        Object.assign(session, dto);
        return this.sessionRepository.save(session);
    }

    /**
     * Delete a session and all its messages
     */
    async delete(id: number, adminId?: number): Promise<void> {
        const session = await this.sessionRepository.findOne({ where: { id } });

        if (!session) {
            throw new NotFoundException(`Chat session with ID ${id} not found`);
        }

        if (adminId && session.adminId !== adminId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        // Delete all messages first (cascade should handle this, but being explicit)
        await this.messageRepository.delete({ sessionId: id });

        // Delete the session
        await this.sessionRepository.remove(session);
    }

    /**
     * Save messages to a session
     */
    async saveMessages(
        sessionId: number,
        dto: SaveMessagesDto,
        adminId?: number,
    ): Promise<void> {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundException(
                `Chat session with ID ${sessionId} not found`,
            );
        }

        if (adminId && session.adminId !== adminId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        // Create message entities
        const messages = dto.messages.map((msg) =>
            this.messageRepository.create({
                sessionId,
                role: msg.role,
                content: msg.content,
                blocks: msg.blocks || null,
            }),
        );

        // Save all messages
        await this.messageRepository.save(messages);

        // Update session's message count and updatedAt
        session.messagesCount = await this.messageRepository.count({
            where: { sessionId },
        });
        session.updatedAt = new Date();

        // Auto-generate title from first user message if still "New Chat"
        if (session.title === 'New Chat' && messages.length > 0) {
            const firstUserMessage = dto.messages.find((msg) => msg.role === 'user');
            if (firstUserMessage) {
                session.title = this.generateTitle(firstUserMessage.content);
            }
        }

        await this.sessionRepository.save(session);
    }

    /**
     * Generate a title from the first user message
     */
    generateTitle(firstMessage: string): string {
        // Remove extra whitespace and newlines
        const cleaned = firstMessage.trim().replace(/\s+/g, ' ');

        // Take first 50 characters
        let title = cleaned.substring(0, 50);

        // If we cut in the middle of a word, try to end at last complete word
        if (cleaned.length > 50) {
            const lastSpace = title.lastIndexOf(' ');
            if (lastSpace > 20) {
                // Only trim if we still have reasonable length
                title = title.substring(0, lastSpace);
            }
            title += '...';
        }

        return title || 'New Chat';
    }
}
