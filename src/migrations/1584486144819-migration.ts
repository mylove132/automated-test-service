import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1584486144819 implements MigrationInterface {
    name = 'migration1584486144819'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "scene_scenegrade_enum" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "scene" ADD "sceneGrade" "scene_scenegrade_enum" NOT NULL DEFAULT '2'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-17T23:02:29.910Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-17T23:02:29.910Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-17 08:46:05.091'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-17 08:46:05.091'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "scene" DROP COLUMN "sceneGrade"`, undefined);
        await queryRunner.query(`DROP TYPE "scene_scenegrade_enum"`, undefined);
    }

}
