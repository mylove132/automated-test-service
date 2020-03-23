ALTER TABLE "secheduler" ADD "name" character varying;
ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-19T05:50:58.643Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-19T05:50:58.643Z"';
ALTER TABLE "secheduler" DROP CONSTRAINT "UQ_7df896c01ff7c4192a3dfb83f70";
ALTER TABLE "secheduler" ADD CONSTRAINT "UQ_7bbbccb847cf3285fb7ad1ee84d" UNIQUE ("md5", "name");