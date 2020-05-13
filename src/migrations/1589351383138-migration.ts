import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1589351383138 implements MigrationInterface {
    name = 'migration1589351383138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-13T06:29:45.060Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-13T06:29:45.060Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" ALTER COLUMN "resultFields" DROP NOT NULL`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "dyn_sql"."resultFields" IS '结果属性字段'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "dyn_sql"."resultFields" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" ALTER COLUMN "resultFields" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-13 04:05:40.135'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-13 04:05:40.135'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
    }

}
