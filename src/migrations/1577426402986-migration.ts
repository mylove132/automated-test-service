import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1577426402986 implements MigrationInterface {
    name = 'migration1577426402986'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "secheduler_status_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD "status" "secheduler_status_enum" NOT NULL DEFAULT '1'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP COLUMN "status"`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_status_enum"`, undefined);
    }

}
