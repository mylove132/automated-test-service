import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1588243640276 implements MigrationInterface {
    name = 'migration1588243640276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "jmeter_result_jmeterrunstatus_enum" AS ENUM('1', '2', '3', '4')`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" ADD "jmeterRunStatus" "jmeter_result_jmeterrunstatus_enum" NOT NULL DEFAULT '4'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-30T10:47:22.018Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-30T10:47:22.018Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-29 03:30:20.148'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-29 03:30:20.148'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" DROP COLUMN "jmeterRunStatus"`, undefined);
        await queryRunner.query(`DROP TYPE "jmeter_result_jmeterrunstatus_enum"`, undefined);
    }

}
