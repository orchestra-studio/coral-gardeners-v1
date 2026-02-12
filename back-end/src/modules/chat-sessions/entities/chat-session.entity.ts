import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_sessions')
export class ChatSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ name: 'admin_id', nullable: true })
    adminId: number;

    @Column({ length: 100 })
    model: string;

    @Column({ length: 50 })
    provider: string;

    @Column({ name: 'messages_count', default: 0 })
    messagesCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'is_archived', default: false })
    isArchived: boolean;

    @ManyToOne('Admin', { nullable: true })
    @JoinColumn({ name: 'admin_id' })
    admin?: any;

    @OneToMany(() => ChatMessage, (message) => message.session)
    messages: ChatMessage[];
}
