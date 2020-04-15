import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586924443801 implements MigrationInterface {
    name = 'migration1586924443801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_c686adc17f1ec523275b1ddc995"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP COLUMN "taskType"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."secheduler_tasktype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "caseType"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."case_casetype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "sceneId"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-15T04:20:45.591Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-15T04:20:45.591Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-12 03:35:34.505'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-12 03:35:34.505'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD "sceneId" integer`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."case_casetype_enum" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD "caseType" "case_casetype_enum" NOT NULL DEFAULT '0'`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."secheduler_tasktype_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD "taskType" "secheduler_tasktype_enum" NOT NULL DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_c686adc17f1ec523275b1ddc995" FOREIGN KEY ("sceneId") REFERENCES "scene"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

}
