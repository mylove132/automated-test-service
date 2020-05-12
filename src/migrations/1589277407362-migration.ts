import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1589277407362 implements MigrationInterface {
    name = 'migration1589277407362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dyn_sql" ("id" SERIAL NOT NULL, "sql" character varying NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "dynDbId" integer, CONSTRAINT "PK_3893ccb87f7af00775e8d00b86a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "dyn_db" ("id" SERIAL NOT NULL, "dbName" character varying NOT NULL, "dbHost" character varying NOT NULL, "dbPort" integer NOT NULL, "dbUsername" character varying NOT NULL, "dbPassword" character varying NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5ab0b60fcd14b126d4e5224b991" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS '循环次数'`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT -1`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-05-12T09:56:49.236Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-05-12T09:56:49.236Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "dyn_sql" ADD CONSTRAINT "FK_8b46a34e1828dc194130c9d8d43" FOREIGN KEY ("dynDbId") REFERENCES "dyn_db"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dyn_sql" DROP CONSTRAINT "FK_8b46a34e1828dc194130c9d8d43"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-05-12 08:00:38.012'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-05-12 08:00:38.012'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "jmeter" ALTER COLUMN "loopNum" SET DEFAULT '-1'`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "jmeter"."loopNum" IS ''`, undefined);
        await queryRunner.query(`DROP TABLE "dyn_db"`, undefined);
        await queryRunner.query(`DROP TABLE "dyn_sql"`, undefined);
    }

}
