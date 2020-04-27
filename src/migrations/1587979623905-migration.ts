import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587979623905 implements MigrationInterface {
    name = 'migration1587979623905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_02fd9d506145da4b747d4ec4ca5"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-27T09:27:05.961Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-27T09:27:05.961Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_02fd9d506145da4b747d4ec4ca5" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_02fd9d506145da4b747d4ec4ca5"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-27 09:26:09.199'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-27 09:26:09.199'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_02fd9d506145da4b747d4ec4ca5" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE NO ACTION ON UPDATE CASCADE`, undefined);
    }

}
