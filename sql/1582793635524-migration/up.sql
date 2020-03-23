ALTER TABLE "catalog" RENAME COLUMN "platformCode" TO "platformCodeId";
CREATE TABLE "platform_code" ("id" SERIAL NOT NULL, "platformCode" character varying NOT NULL DEFAULT '000', CONSTRAINT "PK_082c72174cc10a5fb014eab64c3" PRIMARY KEY ("id"));
ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "catalog" DROP COLUMN "platformCodeId";
ALTER TABLE "catalog" ADD "platformCodeId" integer;
ALTER TABLE "catalog" ADD CONSTRAINT "UQ_f18cd600ff3e37b382de2cf3a4e" UNIQUE ("platformCodeId");
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-02-27T08:53:59.046Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-02-27T08:53:59.046Z"';
ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;