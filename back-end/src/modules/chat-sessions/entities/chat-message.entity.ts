import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChatSession } from './chat-session.entity';

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'session_id' })
    sessionId: number;

    @Column({
        type: 'varchar',
        length: 20,
    })
    role: 'user' | 'assistant' | 'system';

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'json', nullable: true })
    blocks: Record<string, unknown>[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => ChatSession, (session) => session.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'session_id' })
    session: ChatSession;
}
