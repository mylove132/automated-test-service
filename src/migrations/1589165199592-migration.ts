import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1589165199592 implements MigrationInterface {
    name = 'migration1589165199592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-11T02:46:41.302Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-11T02:46:41.302Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-11 02:45:30.106'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-11 02:45:30.106'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
