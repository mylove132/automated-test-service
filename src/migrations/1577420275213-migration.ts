import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1577420275213 implements MigrationInterface {
    name = 'migration1577420275213'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_ed8cc133f74b5c7a7217cb7934f"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "REL_ed8cc133f74b5c7a7217cb7934"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "REL_1e74448f8a690f0f38a2d84be0"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_ed8cc133f74b5c7a7217cb7934f" FOREIGN KEY ("caseListId") REFERENCES "caselist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_ed8cc133f74b5c7a7217cb7934f"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "REL_1e74448f8a690f0f38a2d84be0" UNIQUE ("envId")`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "REL_ed8cc133f74b5c7a7217cb7934" UNIQUE ("caseListId")`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_ed8cc133f74b5c7a7217cb7934f" FOREIGN KEY ("caseListId") REFERENCES "caselist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
