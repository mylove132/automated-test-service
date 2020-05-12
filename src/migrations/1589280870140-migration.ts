import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1589280870140 implements MigrationInterface {
    name = 'migration1589280870140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dyn_sql" ADD "resultFields" character varying NOT NULL`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-12T10:54:32.266Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-12T10:54:32.266Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-12 09:56:49.236'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-12 09:56:49.236'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" DROP COLUMN "resultFields"`, undefined);
    }

}
