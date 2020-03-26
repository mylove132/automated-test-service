import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1585220828951 implements MigrationInterface {
    name = 'migration1585220828951'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exception" ADD "errorCode" integer`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."secheduler_tasktype_enum" RENAME TO "secheduler_tasktype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_tasktype_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" TYPE "secheduler_tasktype_enum" USING "taskType"::"text"::"secheduler_tasktype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" SET DEFAULT '0'`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_tasktype_enum_old"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "secheduler"."taskType" IS '任务类别'`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" SET DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."secheduler_status_enum" RENAME TO "secheduler_status_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_status_enum" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" TYPE "secheduler_status_enum" USING "status"::"text"::"secheduler_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_status_enum_old"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "secheduler"."status" IS '定时任务状态'`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-26T11:07:11.144Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-26T11:07:11.144Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-26 07:13:35.808'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-26 07:13:35.808'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '2'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "secheduler"."status" IS ''`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_status_enum_old" AS ENUM('0', '1', '2', '3')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" TYPE "secheduler_status_enum_old" USING "status"::"text"::"secheduler_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_status_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "secheduler_status_enum_old" RENAME TO  "secheduler_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "secheduler"."taskType" IS ''`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_tasktype_enum_old" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" TYPE "secheduler_tasktype_enum_old" USING "taskType"::"text"::"secheduler_tasktype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "taskType" SET DEFAULT '0'`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_tasktype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "secheduler_tasktype_enum_old" RENAME TO  "secheduler_tasktype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" DROP COLUMN "errorCode"`, undefined);
    }

}
