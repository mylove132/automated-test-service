import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1586136656463 implements MigrationInterface {
    name = 'migration1586136656463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-06T01:31:02.055Z"'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-06T01:31:02.055Z"'`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."operate_operatemodule_enum" RENAME TO "operate_operatemodule_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "operate_operatemodule_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10')`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateModule" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateModule" TYPE "operate_operatemodule_enum" USING "operateModule"::"text"::"operate_operatemodule_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateModule" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`DROP TYPE "operate_operatemodule_enum_old"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "operate"."operateModule" IS '操作模块'`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."operate_operatetype_enum" RENAME TO "operate_operatetype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "operate_operatetype_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateType" TYPE "operate_operatetype_enum" USING "operateType"::"text"::"operate_operatetype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateType" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`DROP TYPE "operate_operatetype_enum_old"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "operate"."operateType" IS '操作类型'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "operate"."operateType" IS ''`, undefined);
        await queryRunner.query(`CREATE TYPE "operate_operatetype_enum_old" AS ENUM('1', '2', '3')`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateType" TYPE "operate_operatetype_enum_old" USING "operateType"::"text"::"operate_operatetype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateType" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`DROP TYPE "operate_operatetype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "operate_operatetype_enum_old" RENAME TO  "operate_operatetype_enum"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "operate"."operateModule" IS ''`, undefined);
        await queryRunner.query(`CREATE TYPE "operate_operatemodule_enum_old" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateModule" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateModule" TYPE "operate_operatemodule_enum_old" USING "operateModule"::"text"::"operate_operatemodule_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "operate" ALTER COLUMN "operateModule" SET DEFAULT '1'`, undefined);
        await queryRunner.query(`DROP TYPE "operate_operatemodule_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "operate_operatemodule_enum_old" RENAME TO  "operate_operatemodule_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-06 01:15:44.082'`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-06 01:15:44.082'`, undefined);
        await queryRunner.query(`ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
    }

}
