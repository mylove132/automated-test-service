import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587033185771 implements MigrationInterface {
    name = 'migration1587033185771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`CREATE TABLE "secheduler_catalogs_catalog" ("sechedulerId" integer NOT NULL, "catalogId" integer NOT NULL, CONSTRAINT "PK_040e10841c4ed6d74d501456611" PRIMARY KEY ("sechedulerId", "catalogId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c8170a590fb4460220c9f2cae3" ON "secheduler_catalogs_catalog" ("sechedulerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_0b156f1316d0acaaf7310fc61b" ON "secheduler_catalogs_catalog" ("catalogId") `, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD "schedulersId" integer`, undefined);

        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39" FOREIGN KEY ("schedulersId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_c8170a590fb4460220c9f2cae30"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-16 10:14:06.448'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-16 10:14:06.448'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP COLUMN "schedulersId"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_0b156f1316d0acaaf7310fc61b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c8170a590fb4460220c9f2cae3"`, undefined);
        await queryRunner.query(`DROP TABLE "secheduler_catalogs_catalog"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
