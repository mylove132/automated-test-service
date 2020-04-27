import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587980845384 implements MigrationInterface {
    name = 'migration1587980845384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_6f14c4f8d3ac48202e729524cd4"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_ace50cf5ad4f83ebf45e718182d"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_da485311d910dcd2ff151d8a0a6"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_43b7d44134b7a0fbf9fb572aded"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_7bedaea7848005f61a37b1fe254"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-27T09:47:27.148Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-27T09:47:27.148Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_ace50cf5ad4f83ebf45e718182d" FOREIGN KEY ("assertTypeId") REFERENCES "assert_type"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_da485311d910dcd2ff151d8a0a6" FOREIGN KEY ("assertJudgeId") REFERENCES "assert_judge"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_6f14c4f8d3ac48202e729524cd4" FOREIGN KEY ("endpointObjectId") REFERENCES "endpoint"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_7bedaea7848005f61a37b1fe254" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_43b7d44134b7a0fbf9fb572aded" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_43b7d44134b7a0fbf9fb572aded"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_7bedaea7848005f61a37b1fe254"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_6f14c4f8d3ac48202e729524cd4"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_da485311d910dcd2ff151d8a0a6"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_ace50cf5ad4f83ebf45e718182d"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-27 09:40:39.848'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-27 09:40:39.848'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_7bedaea7848005f61a37b1fe254" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_43b7d44134b7a0fbf9fb572aded" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_da485311d910dcd2ff151d8a0a6" FOREIGN KEY ("assertJudgeId") REFERENCES "assert_judge"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_ace50cf5ad4f83ebf45e718182d" FOREIGN KEY ("assertTypeId") REFERENCES "assert_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_6f14c4f8d3ac48202e729524cd4" FOREIGN KEY ("endpointObjectId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

}
