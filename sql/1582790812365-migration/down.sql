SET AUTOCOMMIT=0;
START TRANSACTION;
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '2020-02-26 03:35:30.373';
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '2020-02-26 03:35:30.373';
ALTER TABLE "catalog" ALTER COLUMN "parentId" DROP DEFAULT;
ALTER TABLE "catalog" DROP COLUMN "platformCode";
ALTER TABLE "scene" DROP COLUMN "desc";
COMMIT;