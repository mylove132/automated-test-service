import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587019166902 implements MigrationInterface {
    name = 'migration1587019166902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "secheduler_tasktype_enum" AS ENUM('1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD "taskType" "secheduler_tasktype_enum" NOT NULL DEFAULT '1'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-16T06:39:28.730Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-16T06:39:28.730Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-16 03:54:43.132'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-16 03:54:43.132'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP COLUMN "taskType"`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_tasktype_enum"`, undefined);
    }

}
