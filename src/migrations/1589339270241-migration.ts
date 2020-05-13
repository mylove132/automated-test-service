import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1589339270241 implements MigrationInterface {
    name = 'migration1589339270241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dyn_sql" ADD "sqlAlias" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" ADD CONSTRAINT "UQ_2f17cefbea486efe5b3482334bd" UNIQUE ("sqlAlias")`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-13T03:07:52.385Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-13T03:07:52.385Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-13 02:50:55.58'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-13 02:50:55.58'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" DROP CONSTRAINT "UQ_2f17cefbea486efe5b3482334bd"`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" DROP COLUMN "sqlAlias"`, undefined);
    }

}
