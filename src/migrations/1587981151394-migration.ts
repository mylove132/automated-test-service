import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587981151394 implements MigrationInterface {
    name = 'migration1587981151394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_f6009d27f6d6e09f704dd4d9c61"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_abed00d04837320ba2222e0ccf8"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_66f6eb43821666df150f4dcf2e1"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" DROP CONSTRAINT "FK_d4abd611d465004bdbedc35cd81"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" DROP CONSTRAINT "FK_f55997d34151be1ea91f27f252d"`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" DROP CONSTRAINT "FK_4c4c958fc1ab954136d873ea11c"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_c8170a590fb4460220c9f2cae30"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-27T09:52:33.227Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-27T09:52:33.227Z"'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_abed00d04837320ba2222e0ccf8" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_f6009d27f6d6e09f704dd4d9c61" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_66f6eb43821666df150f4dcf2e1" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" ADD CONSTRAINT "FK_d4abd611d465004bdbedc35cd81" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD CONSTRAINT "FK_f55997d34151be1ea91f27f252d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" ADD CONSTRAINT "FK_4c4c958fc1ab954136d873ea11c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_c8170a590fb4460220c9f2cae30"`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" DROP CONSTRAINT "FK_4c4c958fc1ab954136d873ea11c"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" DROP CONSTRAINT "FK_f55997d34151be1ea91f27f252d"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" DROP CONSTRAINT "FK_d4abd611d465004bdbedc35cd81"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_66f6eb43821666df150f4dcf2e1"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_f6009d27f6d6e09f704dd4d9c61"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_abed00d04837320ba2222e0ccf8"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-27 09:47:27.148'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-27 09:47:27.148'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" ADD CONSTRAINT "FK_4c4c958fc1ab954136d873ea11c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD CONSTRAINT "FK_f55997d34151be1ea91f27f252d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter_result" ADD CONSTRAINT "FK_d4abd611d465004bdbedc35cd81" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_66f6eb43821666df150f4dcf2e1" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_abed00d04837320ba2222e0ccf8" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_f6009d27f6d6e09f704dd4d9c61" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

}
