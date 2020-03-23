CREATE TABLE "scene" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "dependenceCaseJson" text, "catalogId" integer, CONSTRAINT "PK_680b182e0d3bd68553f944295f4" PRIMARY KEY ("id"));
ALTER TABLE "case" ADD "isDependenceParam" boolean NOT NULL DEFAULT false;
ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-26T03:35:30.373Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-26T03:35:30.373Z"';
ALTER TABLE "scene" ADD CONSTRAINT "FK_bd19649c5295ca5aaaf00aa5190" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;