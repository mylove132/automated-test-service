import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1578036015672 implements MigrationInterface {
    name = 'migration1578036015672'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_d72ea127f30e21753c9e229891e"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "image" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD "result" text`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "result"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "image"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "userId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId")`, undefined);
    }

}
