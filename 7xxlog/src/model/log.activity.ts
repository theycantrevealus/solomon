import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'log_activity' })
export class LogActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'uuid' })
    user_uid: string;

    @Column({ nullable: false, type: 'text' })
    table_name: string;

    @Column({ nullable: false, type: 'character', length: 1 })
    action: string;

    @Column({ nullable: false, type: 'timestamp without time zone' })
    logged_at: string;

    @Column({ nullable: true, type: 'text' })
    old_value: string;

    @Column({ nullable: true, type: 'text' })
    new_value: string;

    @Column({ nullable: false, type: 'character', length: 1 })
    status: string;

    @Column({ nullable: false, type: 'integer' })
    login_id: string;

    @Column({ nullable: true, type: 'character varying' })
    unique_target: string;
}
