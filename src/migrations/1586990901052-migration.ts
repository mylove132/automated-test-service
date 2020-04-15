import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586990901052 implements MigrationInterface {
    name = 'migration1586990901052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_result" ("id" SERIAL NOT NULL, "result" text NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "schedulerId" integer, CONSTRAINT "PK_623dd43986d67c74bad752b37a5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-15T22:48:24.062Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-15T22:48:24.062Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "task_result" ADD CONSTRAINT "FK_b45df38118257e497e6792c6a1a" FOREIGN KEY ("schedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_result" DROP CONSTRAINT "FK_b45df38118257e497e6792c6a1a"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-15 06:47:19.545'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-15 06:47:19.545'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "task_result"`, undefined);
    }

}
