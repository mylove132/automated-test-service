import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1588755586654 implements MigrationInterface {
    name = 'migration1588755586654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter" RENAME COLUMN "md5" TO "stream"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" RENAME CONSTRAINT "UQ_d4dbc9ae055488e899c08a22b98" TO "UQ_0ed12ba15fb81cb7cf434381406"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-06T08:59:48.781Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-06T08:59:48.781Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" DROP CONSTRAINT "UQ_0ed12ba15fb81cb7cf434381406"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" DROP COLUMN "stream"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ADD "stream" bytea`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter" DROP COLUMN "stream"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ADD "stream" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ADD CONSTRAINT "UQ_0ed12ba15fb81cb7cf434381406" UNIQUE ("stream")`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-06 08:50:09.259'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-06 08:50:09.259'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" RENAME CONSTRAINT "UQ_0ed12ba15fb81cb7cf434381406" TO "UQ_d4dbc9ae055488e899c08a22b98"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" RENAME COLUMN "stream" TO "md5"`, undefined);
    }

}
