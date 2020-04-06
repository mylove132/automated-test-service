import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586135079704 implements MigrationInterface {
    name = 'migration1586135079704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-06T01:04:44.896Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-06T01:04:44.896Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" DROP COLUMN "operateType"`, undefined);
        await queryRunner.query(`CREATE TYPE "operate_operatetype_enum" AS ENUM('1', '2', '3')`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD "operateType" "operate_operatetype_enum" NOT NULL DEFAULT '1'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operate" DROP COLUMN "operateType"`, undefined);
        await queryRunner.query(`DROP TYPE "operate_operatetype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD "operateType" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-31 09:20:58.816'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-31 09:20:58.816'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
