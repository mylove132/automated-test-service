import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1582793635524 implements MigrationInterface {
    name = 'migration1582793635524'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" RENAME COLUMN "platformCode" TO "platformCodeId"`, undefined);
        await queryRunner.query(`CREATE TABLE "platform_code" ("id" SERIAL NOT NULL, "platformCode" character varying NOT NULL DEFAULT '000', CONSTRAINT "PK_082c72174cc10a5fb014eab64c3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP COLUMN "platformCodeId"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD "platformCodeId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "UQ_f18cd600ff3e37b382de2cf3a4e" UNIQUE ("platformCodeId")`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-27T08:53:59.046Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-27T08:53:59.046Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-02-27 08:16:16.593'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-02-27 08:16:16.593'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "UQ_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP COLUMN "platformCodeId"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD "platformCodeId" character varying NOT NULL DEFAULT '000'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "platform_code"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" RENAME COLUMN "platformCodeId" TO "platformCode"`, undefined);
    }

}
