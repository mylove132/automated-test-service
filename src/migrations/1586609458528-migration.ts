import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586609458528 implements MigrationInterface {
    name = 'migration1586609458528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scene" DROP COLUMN "dependenceCaseJson"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD "sceneId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-11T12:51:01.437Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-11T12:51:01.437Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_c686adc17f1ec523275b1ddc995" FOREIGN KEY ("sceneId") REFERENCES "scene"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_c686adc17f1ec523275b1ddc995"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-10 10:01:53.713'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-10 10:01:53.713'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "sceneId"`, undefined);
        await queryRunner.query(`ALTER TABLE "scene" ADD "dependenceCaseJson" text`, undefined);
    }

}
