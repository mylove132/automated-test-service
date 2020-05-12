import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1589269411375 implements MigrationInterface {
    name = 'migration1589269411375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "secheduler_jmeters_jmeter" ("sechedulerId" integer NOT NULL, "jmeterId" integer NOT NULL, CONSTRAINT "PK_3d9dc4359bac1e8e7c322ad55e2" PRIMARY KEY ("sechedulerId", "jmeterId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a29303d44d2ec915b729867783" ON "secheduler_jmeters_jmeter" ("sechedulerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9bb621395da4b2f0a09902b8a6" ON "secheduler_jmeters_jmeter" ("jmeterId") `, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD "isRealDelete" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-12T07:43:33.353Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-12T07:43:33.353Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_jmeters_jmeter" ADD CONSTRAINT "FK_a29303d44d2ec915b729867783c" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_jmeters_jmeter" ADD CONSTRAINT "FK_9bb621395da4b2f0a09902b8a61" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secheduler_jmeters_jmeter" DROP CONSTRAINT "FK_9bb621395da4b2f0a09902b8a61"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_jmeters_jmeter" DROP CONSTRAINT "FK_a29303d44d2ec915b729867783c"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-11 07:09:53.404'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-11 07:09:53.404'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP COLUMN "isRealDelete"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9bb621395da4b2f0a09902b8a6"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a29303d44d2ec915b729867783"`, undefined);
        await queryRunner.query(`DROP TABLE "secheduler_jmeters_jmeter"`, undefined);
    }

}
