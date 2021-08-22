import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'inventory_item' })
export class MasterItem {
  @PrimaryColumn()
  @Column({ nullable: false, type: 'uuid', primary: true })
  uid: string;

  @Column({ nullable: false, type: 'character varying' })
  kode: string;

  @Column({ nullable: false, type: 'character varying' })
  nama: string;

  @Column({ nullable: false, type: 'uuid' })
  units: string;

  @Column({ nullable: false, type: 'uuid' })
  manufacture: string;

  @Column({ nullable: false, type: 'timestamp without time zone' })
  created_at: string;

  @Column({ nullable: false, type: 'timestamp without time zone' })
  updated_at: string;

  @Column({ nullable: true, type: 'timestamp without time zone' })
  deleted_at: string;
}
