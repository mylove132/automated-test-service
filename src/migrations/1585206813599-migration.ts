import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1585206813599 implements MigrationInterface {
    name = 'migration1585206813599'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exception" DROP COLUMN "errorCode"`, undefined);
        await queryRunner.query(`ALTER TABLE "platform_code" ADD "name" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-26T07:13:35.808Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-26T07:13:35.808Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-24 22:46:38.735'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-24 22:46:38.735'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "platform_code" DROP COLUMN "name"`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" ADD "errorCode" integer NOT NULL`, undefined);
    }

}
