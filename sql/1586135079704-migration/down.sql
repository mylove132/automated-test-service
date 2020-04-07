SET AUTOCOMMIT=0;
START TRANSACTION;
ALTER TABLE "operate" DROP COLUMN "operateType";
DROP TYPE "operate_operatetype_enum";
ALTER TABLE "operate" ADD "operateType" character varying NOT NULL;
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-03-31 09:20:58.816';
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-03-31 09:20:58.816';
ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT;
