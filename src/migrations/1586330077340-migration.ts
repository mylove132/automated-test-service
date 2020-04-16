import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586330077340 implements MigrationInterface {
    name = 'migration1586330077340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."secheduler_status_enum" RENAME TO "secheduler_status_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_status_enum" AS ENUM('1', '2', '3')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" TYPE "secheduler_status_enum" USING "status"::"text"::"secheduler_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '2'`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_status_enum_old"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "secheduler"."status" IS '定时任务状态'`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '2'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-08T07:14:38.996Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-08T07:14:38.996Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-08 07:13:45.785'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-08 07:13:45.785'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "secheduler"."status" IS ''`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_status_enum_old" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" TYPE "secheduler_status_enum_old" USING "status"::"text"::"secheduler_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ALTER COLUMN "status" SET DEFAULT '2'`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_status_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "secheduler_status_enum_old" RENAME TO  "secheduler_status_enum"`, undefined);
    }

}