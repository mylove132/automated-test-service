ALTER TABLE "scene" ADD "desc" character varying NOT NULL;
ALTER TABLE "catalog" ADD "platformCode" character varying NOT NULL DEFAULT '000';
ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-27T08:06:55.900Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-27T08:06:55.900Z"';