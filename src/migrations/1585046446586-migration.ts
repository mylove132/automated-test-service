import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1585046446586 implements MigrationInterface {
    name = 'migration1585046446586'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exception" ADD "uri" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" ADD "excName" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-24T10:40:48.924Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-24T10:40:48.924Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-24 10:37:19.588'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-24 10:37:19.588'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" DROP COLUMN "excName"`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" DROP COLUMN "uri"`, undefined);
    }

}
