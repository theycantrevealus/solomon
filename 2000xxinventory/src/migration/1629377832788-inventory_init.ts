import { MigrationInterface, QueryRunner } from 'typeorm';

export class inventoryInit1629377832788 implements MigrationInterface {
  name = 'inventoryInit1629377832788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inventory_item" ("uid" uuid NOT NULL, "kode" character varying NOT NULL, "nama" character varying NOT NULL, "units" uuid NOT NULL, "manufacture" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_4aa085f2067ae7df7ed69216db8" PRIMARY KEY ("uid"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inventory_item"`);
  }
}
