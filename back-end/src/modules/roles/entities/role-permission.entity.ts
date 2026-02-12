import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('role_permissions')
@Index(['role_id', 'permission_id'], { unique: true })
export class RolePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    role_id: number;

    @Column()
    @Index()
    permission_id: number;

    @CreateDateColumn()
    created_at: Date;
}
