import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587721938918 implements MigrationInterface {
    name = 'migration1587721938918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" ADD "jmeterId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-24T09:52:20.721Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-24T09:52:20.721Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_7bedaea7848005f61a37b1fe254" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_7bedaea7848005f61a37b1fe254"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-21 06:57:42.742'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-21 06:57:42.742'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "jmeterId"`, undefined);
    }

}
