import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1578040177970 implements MigrationInterface {
    name = 'migration1578040177970'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ADD "startTime" TIMESTAMP NOT NULL DEFAULT '"2020-01-03T08:29:39.483Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD "endTime" TIMESTAMP NOT NULL DEFAULT '"2020-01-03T08:29:39.483Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "endTime"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "startTime"`, undefined);
    }

}
