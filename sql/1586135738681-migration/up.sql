ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-04-06T01:15:44.082Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-04-06T01:15:44.082Z"';
ALTER TABLE "operate" DROP COLUMN "operateModule";
CREATE TYPE "operate_operatemodule_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9');
ALTER TABLE "operate" ADD "operateModule" "operate_operatemodule_enum" NOT NULL DEFAULT '1';
COMMIT;
