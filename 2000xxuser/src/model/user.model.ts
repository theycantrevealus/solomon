import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity({ name: 'user' })
export class UserModel {
  @PrimaryColumn()
  @Generated('uuid')
  @Column({ nullable: false, type: 'uuid', primary: true })
  uid: string;

  @Column({ nullable: false, type: 'character varying' })
  email: string;

  @Column({ nullable: false, type: 'character varying' })
  first_name: string;

  @Column({ nullable: false, type: 'character varying' })
  last_name: string;

  @Column({ nullable: false, type: 'character varying' })
  password: string;

  @Column({ nullable: false, type: 'timestamp without time zone' })
  created_at: string;

  @Column({ nullable: false, type: 'timestamp without time zone' })
  updated_at: string;

  @Column({ nullable: true, type: 'timestamp without time zone' })
  deleted_at: string;
}
