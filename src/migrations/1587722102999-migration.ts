import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587722102999 implements MigrationInterface {
    name = 'migration1587722102999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter" ADD "md5" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ADD CONSTRAINT "UQ_d4dbc9ae055488e899c08a22b98" UNIQUE ("md5")`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-24T09:55:04.739Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-24T09:55:04.739Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-24 09:52:20.721'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-24 09:52:20.721'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" DROP CONSTRAINT "UQ_d4dbc9ae055488e899c08a22b98"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" DROP COLUMN "md5"`, undefined);
    }

}
