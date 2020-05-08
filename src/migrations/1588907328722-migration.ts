import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1588907328722 implements MigrationInterface {
    name = 'migration1588907328722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_c8170a590fb4460220c9f2cae30"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-08T03:08:50.664Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-08T03:08:50.664Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_c8170a590fb4460220c9f2cae30"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-08 03:08:14.137'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-08 03:08:14.137'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
    }

}
