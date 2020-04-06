import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586135738681 implements MigrationInterface {
    name = 'migration1586135738681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-06T01:15:44.082Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-06T01:15:44.082Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" DROP COLUMN "operateModule"`, undefined);
        await queryRunner.query(`CREATE TYPE "operate_operatemodule_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD "operateModule" "operate_operatemodule_enum" NOT NULL DEFAULT '1'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operate" DROP COLUMN "operateModule"`, undefined);
        await queryRunner.query(`DROP TYPE "operate_operatemodule_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD "operateModule" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-06 01:04:44.896'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-06 01:04:44.896'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
