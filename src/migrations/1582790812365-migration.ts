import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1582790812365 implements MigrationInterface {
    name = 'migration1582790812365'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "scene" ADD "desc" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD "platformCode" character varying NOT NULL DEFAULT '000'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-27T08:06:55.900Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-27T08:06:55.900Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-02-26 03:35:30.373'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-02-26 03:35:30.373'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP COLUMN "platformCode"`, undefined);
        await queryRunner.query(`ALTER TABLE "scene" DROP COLUMN "desc"`, undefined);
    }

}
