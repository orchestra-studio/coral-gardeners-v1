import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('admin_role')
export class AdminRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    admin_id: number;

    @Column()
    @Index()
    role_id: number;

    @CreateDateColumn()
    created_at: Date;
}
