import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    profile_picture: string;

    @Column({ nullable: true })
    country_id: number;

    @Column({ nullable: true })
    admin_id: number;

    @Column({ type: 'datetime', nullable: true })
    email_verified_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;

    // Virtual relation to country (assuming countries table exists)
    @ManyToOne('Country', { nullable: true, eager: true })
    @JoinColumn({ name: 'country_id' })
    country?: any;

    // Relation to admin who created this user
    @ManyToOne('Admin', { nullable: true })
    @JoinColumn({ name: 'admin_id' })
    admin?: any;
}
