import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1582858689178 implements MigrationInterface {
    name = 'migration1582858689178'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "UQ_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-28T02:58:12.395Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-28T02:58:12.395Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-02-27 08:53:59.046'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-02-27 08:53:59.046'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "UQ_f18cd600ff3e37b382de2cf3a4e" UNIQUE ("platformCodeId")`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
