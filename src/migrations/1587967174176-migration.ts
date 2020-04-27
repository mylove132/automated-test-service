import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587967174176 implements MigrationInterface {
    name = 'migration1587967174176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter" RENAME COLUMN "preResultId" TO "loopNum"`, undefined);
        await queryRunner.query(`CREATE TABLE "jmeter_result" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "jmeterId" integer, CONSTRAINT "PK_deabfe5a1a363149e8efaf1df78" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-27T05:59:36.099Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-27T05:59:36.099Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" DROP COLUMN "loopNum"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ADD "loopNum" integer NOT NULL DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" ADD CONSTRAINT "FK_d4abd611d465004bdbedc35cd81" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter_result" DROP CONSTRAINT "FK_d4abd611d465004bdbedc35cd81"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" DROP COLUMN "loopNum"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ADD "loopNum" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-26 03:00:01.091'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-26 03:00:01.091'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "jmeter_result"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" RENAME COLUMN "loopNum" TO "preResultId"`, undefined);
    }

}
