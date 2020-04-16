import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1587033608572 implements MigrationInterface {
    name = 'migration1587033608572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-16T10:40:10.272Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-16T10:40:10.272Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39" FOREIGN KEY ("schedulersId") REFERENCES "secheduler"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-16 10:33:07.553'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-16 10:33:07.553'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39" FOREIGN KEY ("schedulersId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

}
