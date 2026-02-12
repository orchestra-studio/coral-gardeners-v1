import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'json' })
    display_name: {
        en: string;
        ar: string;
    };

    @Column({ type: 'json', nullable: true })
    description: {
        en: string;
        ar: string;
    };

    @Column()
    module: string; // Group permissions by module (e.g., 'admins', 'roles', 'settings')

    @Column({ default: 'web' })
    guard_name: string;

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
