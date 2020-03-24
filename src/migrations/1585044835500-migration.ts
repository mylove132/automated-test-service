import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1585044835500 implements MigrationInterface {
    name = 'migration1585044835500'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "operate" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "operateModule" character varying NOT NULL, "operateType" character varying NOT NULL, "operateDesc" character varying NOT NULL, "requestParam" text NOT NULL, "responseParam" text NOT NULL, "operateName" character varying NOT NULL, "operateUri" character varying NOT NULL, "operateIp" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_fafadc4808a27e88c715f070040" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "exception" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "requestParam" text NOT NULL, "exceptionMsg" text NOT NULL, "requestIp" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_73a3b52e4fdd3116b67c05c6720" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-24T10:13:58.849Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-24T10:13:58.849Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ADD CONSTRAINT "FK_f55997d34151be1ea91f27f252d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "exception" ADD CONSTRAINT "FK_4c4c958fc1ab954136d873ea11c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exception" DROP CONSTRAINT "FK_4c4c958fc1ab954136d873ea11c"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" DROP CONSTRAINT "FK_f55997d34151be1ea91f27f252d"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-23 10:54:21.392'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-23 10:54:21.392'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "exception"`, undefined);
        await queryRunner.query(`DROP TABLE "operate"`, undefined);
    }

}
