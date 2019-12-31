import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1577683755324 implements MigrationInterface {
    name = 'migration1577683755324'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" DROP CONSTRAINT "FK_1a127b5d5637b19e001bbd9e7a3"`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" DROP CONSTRAINT "FK_2bba748beabbf4542273c9439db"`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" DROP CONSTRAINT "FK_2588ace0e0a662d59c389f31837"`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" DROP CONSTRAINT "FK_020a31ef8f06641ab3e37b98fc1"`, undefined);
        await queryRunner.query(`CREATE TYPE "history_executor_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD "executor" "history_executor_enum" NOT NULL DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
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
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "executor"`, undefined);
        await queryRunner.query(`DROP TYPE "history_executor_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" ADD CONSTRAINT "FK_020a31ef8f06641ab3e37b98fc1" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "case_case_lists_caselist" ADD CONSTRAINT "FK_2588ace0e0a662d59c389f31837" FOREIGN KEY ("caselistId") REFERENCES "caselist"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" ADD CONSTRAINT "FK_2bba748beabbf4542273c9439db" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "endpoint_envs_env" ADD CONSTRAINT "FK_1a127b5d5637b19e001bbd9e7a3" FOREIGN KEY ("endpointId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

}
