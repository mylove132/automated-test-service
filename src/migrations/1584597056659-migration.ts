import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1584597056659 implements MigrationInterface {
    name = 'migration1584597056659'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "secheduler" ADD "name" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-19T05:50:58.643Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-19T05:50:58.643Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "UQ_7df896c01ff7c4192a3dfb83f70"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "UQ_7bbbccb847cf3285fb7ad1ee84d" UNIQUE ("md5", "name")`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "UQ_7bbbccb847cf3285fb7ad1ee84d"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "UQ_7df896c01ff7c4192a3dfb83f70" UNIQUE ("md5")`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-17 23:02:29.91'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-17 23:02:29.91'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP COLUMN "name"`, undefined);
    }

}
