import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1584883630143 implements MigrationInterface {
    name = 'migration1584883630143'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-22T13:27:16.082Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-22T13:27:16.082Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD "token" text`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD "token" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-22 13:10:05.373'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-22 13:10:05.373'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
