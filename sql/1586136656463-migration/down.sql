SET AUTOCOMMIT=0;
START TRANSACTION;
COMMENT ON COLUMN "operate"."operateType" IS '';
CREATE TYPE "operate_operatetype_enum_old" AS ENUM('1', '2', '3');
ALTER TABLE "operate" ALTER COLUMN "operateType" DROP DEFAULT;
ALTER TABLE "operate" ALTER COLUMN "operateType" TYPE "operate_operatetype_enum_old" USING "operateType"::"text"::"operate_operatetype_enum_old";
ALTER TABLE "operate" ALTER COLUMN "operateType" SET DEFAULT '1';
DROP TYPE "operate_operatetype_enum"
ALTER TYPE "operate_operatetype_enum_old" RENAME TO  "operate_operatetype_enum"
COMMENT ON COLUMN "operate"."operateModule" IS ''
CREATE TYPE "operate_operatemodule_enum_old" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')
ALTER TABLE "operate" ALTER COLUMN "operateModule" DROP DEFAULT
ALTER TABLE "operate" ALTER COLUMN "operateModule" TYPE "operate_operatemodule_enum_old" USING "operateModule"::"text"::"operate_operatemodule_enum_old"
ALTER TABLE "operate" ALTER COLUMN "operateModule" SET DEFAULT '1'
DROP TYPE "operate_operatemodule_enum"
ALTER TYPE "operate_operatemodule_enum_old" RENAME TO  "operate_operatemodule_enum"
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-06 01:15:44.082'
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-06 01:15:44.082'
ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT
