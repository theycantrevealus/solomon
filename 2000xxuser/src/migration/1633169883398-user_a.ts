import {MigrationInterface, QueryRunner} from "typeorm";

export class userA1633169883398 implements MigrationInterface {
    name = 'userA1633169883398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "authority" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "authority"`);
    }

}
