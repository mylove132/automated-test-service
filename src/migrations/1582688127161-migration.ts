import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1582688127161 implements MigrationInterface {
    name = 'migration1582688127161'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "scene" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "dependenceCaseJson" text, "catalogId" integer, CONSTRAINT "PK_680b182e0d3bd68553f944295f4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD "isDependenceParam" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-26T03:35:30.373Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-26T03:35:30.373Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "scene" ADD CONSTRAINT "FK_bd19649c5295ca5aaaf00aa5190" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "scene" DROP CONSTRAINT "FK_bd19649c5295ca5aaaf00aa5190"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-02-23 12:32:09.005'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-02-23 12:32:09.005'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "isDependenceParam"`, undefined);
        await queryRunner.query(`DROP TABLE "scene"`, undefined);
    }

}
