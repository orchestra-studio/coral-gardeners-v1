import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('app_settings')
export class AppSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    key: string;

    @Column('text')
    value: string;

    @Column({ type: 'json', nullable: true })
    display_name: { en: string; ar: string };

    @Column({ type: 'json', nullable: true })
    description: { en: string; ar: string };

    @Column({ default: 'text' })
    type: string; // text, number, boolean, json

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    admin_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne('Admin', { nullable: true })
    @JoinColumn({ name: 'admin_id' })
    admin?: any;
}
