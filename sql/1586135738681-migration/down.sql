SET AUTOCOMMIT=0;
START TRANSACTION;
ALTER TABLE "operate" DROP COLUMN "operateModule";
DROP TYPE "operate_operatemodule_enum";
ALTER TABLE "operate" ADD "operateModule" character varying NOT NULL;
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-04-06 01:04:44.896';
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-04-06 01:04:44.896';
ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT;
