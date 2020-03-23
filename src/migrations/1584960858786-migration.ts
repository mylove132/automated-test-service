import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1584960858786 implements MigrationInterface {
    name = 'migration1584960858786'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-23T10:54:21.392Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-23T10:54:21.392Z"'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-23 08:18:51.322'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-23 08:18:51.322'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
