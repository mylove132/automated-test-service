import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1579432999075 implements MigrationInterface {
    name = 'migration1579432999075'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "assert_type" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_69a2dc3382dcc580f201b0302cc" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "assert_judge" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_a63c45ab5051e49ffb16c87baef" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD "assertTypeId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD "assertJudgeId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-01-19T11:23:20.549Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-01-19T11:23:20.549Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_ace50cf5ad4f83ebf45e718182d" FOREIGN KEY ("assertTypeId") REFERENCES "assert_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_da485311d910dcd2ff151d8a0a6" FOREIGN KEY ("assertJudgeId") REFERENCES "assert_judge"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_da485311d910dcd2ff151d8a0a6"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_ace50cf5ad4f83ebf45e718182d"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-01-17 06:48:51.289'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-01-17 06:48:51.289'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "assertJudgeId"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "assertTypeId"`, undefined);
        await queryRunner.query(`DROP TABLE "assert_judge"`, undefined);
        await queryRunner.query(`DROP TABLE "assert_type"`, undefined);
    }

}
