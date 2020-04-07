ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-06T01:31:02.055Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-06T01:31:02.055Z"';
ALTER TYPE "public"."operate_operatemodule_enum" RENAME TO "operate_operatemodule_enum_old";
CREATE TYPE "operate_operatemodule_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10');
ALTER TABLE "operate" ALTER COLUMN "operateModule" DROP DEFAULT;
ALTER TABLE "operate" ALTER COLUMN "operateModule" TYPE "operate_operatemodule_enum" USING "operateModule"::"text"::"operate_operatemodule_enum";
ALTER TABLE "operate" ALTER COLUMN "operateModule" SET DEFAULT '1'
DROP TYPE "operate_operatemodule_enum_old";
COMMENT ON COLUMN "operate"."operateModule" IS '操作模块'
ALTER TYPE "public"."operate_operatetype_enum" RENAME TO "operate_operatetype_enum_old"
CREATE TYPE "operate_operatetype_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')
ALTER TABLE "operate" ALTER COLUMN "operateType" DROP DEFAULT
ALTER TABLE "operate" ALTER COLUMN "operateType" TYPE "operate_operatetype_enum" USING "operateType"::"text"::"operate_operatetype_enum";
ALTER TABLE "operate" ALTER COLUMN "operateType" SET DEFAULT '1'
DROP TYPE "operate_operatetype_enum_old";
COMMENT ON COLUMN "operate"."operateType" IS '操作类型';
COMMIT;
