ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-06T01:04:44.896Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-06T01:04:44.896Z"';
ALTER TABLE "operate" DROP COLUMN "operateType";
CREATE TYPE "operate_operatetype_enum" AS ENUM('1', '2', '3');
ALTER TABLE "operate" ADD "operateType" "operate_operatetype_enum" NOT NULL DEFAULT '1';
COMMIT;
