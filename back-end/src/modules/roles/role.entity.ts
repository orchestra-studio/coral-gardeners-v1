import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: 'web' })
    guard_name: string;

    @Column({ nullable: true })
    description: string;

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
