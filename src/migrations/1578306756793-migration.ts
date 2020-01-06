import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1578306756793 implements MigrationInterface {
    name = 'migration1578306756793'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "catalog" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "isPub" boolean NOT NULL DEFAULT false, "parentId" integer DEFAULT null, "userId" integer, CONSTRAINT "PK_782754bded12b4e75ad4afff913" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "history_status_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`CREATE TYPE "history_executor_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`CREATE TABLE "history" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "status" "history_status_enum" NOT NULL DEFAULT '0', "executor" "history_executor_enum" NOT NULL DEFAULT '0', "result" text, "startTime" TIMESTAMP NOT NULL DEFAULT '"2020-01-06T10:32:38.385Z"', "endTime" TIMESTAMP NOT NULL DEFAULT '"2020-01-06T10:32:38.385Z"', "caseId" integer, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "endpoint" character varying NOT NULL, CONSTRAINT "UQ_3c76020e315271d53d01e13d897" UNIQUE ("endpoint"), CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "secheduler_status_enum" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`CREATE TABLE "secheduler" ("id" SERIAL NOT NULL, "md5" character varying NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "status" "secheduler_status_enum" NOT NULL DEFAULT '1', "caseListId" integer, "envId" integer, CONSTRAINT "UQ_7df896c01ff7c4192a3dfb83f70" UNIQUE ("md5"), CONSTRAINT "PK_3405795f816a3563ba9600f5f89" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "env" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3afda6f649f449e9f94b509aaff" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "caselist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "desc" character varying, "cron" character varying, "isTask" boolean NOT NULL DEFAULT false, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "envId" integer, CONSTRAINT "PK_eb37409795fda93ce628a7099e1" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "case_paramtype_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`CREATE TYPE "case_type_enum" AS ENUM('0', '1', '2', '3')`, undefined);
        await queryRunner.query(`CREATE TABLE "case" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "header" json DEFAULT '{}', "param" character varying, "paramType" "case_paramtype_enum" NOT NULL DEFAULT '0', "path" character varying NOT NULL, "endpoint" character varying NOT NULL, "type" "case_type_enum" NOT NULL DEFAULT '0', "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "assertText" character varying NOT NULL, "catalogId" integer, "endpointObjectId" integer, CONSTRAINT "PK_a1b20a2aef6fc438389d2c4aca0" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "endpoint_envs_env" ("endpointId" integer NOT NULL, "envId" integer NOT NULL, CONSTRAINT "PK_5eb339ed1649a2d962480735047" PRIMARY KEY ("endpointId", "envId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_1a127b5d5637b19e001bbd9e7a" ON "endpoint_envs_env" ("endpointId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2bba748beabbf4542273c9439d" ON "endpoint_envs_env" ("envId") `, undefined);
        await queryRunner.query(`CREATE TABLE "case_case_lists_caselist" ("caseId" integer NOT NULL, "caselistId" integer NOT NULL, CONSTRAINT "PK_3f79dd6d05705774ece1777bdee" PRIMARY KEY ("caseId", "caselistId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_020a31ef8f06641ab3e37b98fc" ON "case_case_lists_caselist" ("caseId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2588ace0e0a662d59c389f3183" ON "case_case_lists_caselist" ("caselistId") `, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_6b0daca4bde404abcf88f305f03" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_66f6eb43821666df150f4dcf2e1" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_ed8cc133f74b5c7a7217cb7934f" FOREIGN KEY ("caseListId") REFERENCES "caselist"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" ADD CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "caselist" ADD CONSTRAINT "FK_d16db6fb900fded908867619508" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_02fd9d506145da4b747d4ec4ca5" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_6f14c4f8d3ac48202e729524cd4" FOREIGN KEY ("endpointObjectId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" ADD CONSTRAINT "FK_1a127b5d5637b19e001bbd9e7a3" FOREIGN KEY ("endpointId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" ADD CONSTRAINT "FK_2bba748beabbf4542273c9439db" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" ADD CONSTRAINT "FK_020a31ef8f06641ab3e37b98fc1" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" ADD CONSTRAINT "FK_2588ace0e0a662d59c389f31837" FOREIGN KEY ("caselistId") REFERENCES "caselist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" DROP CONSTRAINT "FK_2588ace0e0a662d59c389f31837"`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" DROP CONSTRAINT "FK_020a31ef8f06641ab3e37b98fc1"`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" DROP CONSTRAINT "FK_2bba748beabbf4542273c9439db"`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" DROP CONSTRAINT "FK_1a127b5d5637b19e001bbd9e7a3"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_6f14c4f8d3ac48202e729524cd4"`, undefined);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_02fd9d506145da4b747d4ec4ca5"`, undefined);
        await queryRunner.query(`ALTER TABLE "caselist" DROP CONSTRAINT "FK_d16db6fb900fded908867619508"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_1e74448f8a690f0f38a2d84be0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "secheduler" DROP CONSTRAINT "FK_ed8cc133f74b5c7a7217cb7934f"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_66f6eb43821666df150f4dcf2e1"`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_6b0daca4bde404abcf88f305f03"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2588ace0e0a662d59c389f3183"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_020a31ef8f06641ab3e37b98fc"`, undefined);
        await queryRunner.query(`DROP TABLE "case_case_lists_caselist"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2bba748beabbf4542273c9439d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_1a127b5d5637b19e001bbd9e7a"`, undefined);
        await queryRunner.query(`DROP TABLE "endpoint_envs_env"`, undefined);
        await queryRunner.query(`DROP TABLE "case"`, undefined);
        await queryRunner.query(`DROP TYPE "case_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "case_paramtype_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "caselist"`, undefined);
        await queryRunner.query(`DROP TABLE "env"`, undefined);
        await queryRunner.query(`DROP TABLE "secheduler"`, undefined);
        await queryRunner.query(`DROP TYPE "secheduler_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "endpoint"`, undefined);
        await queryRunner.query(`DROP TABLE "history"`, undefined);
        await queryRunner.query(`DROP TYPE "history_executor_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "history_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "catalog"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
