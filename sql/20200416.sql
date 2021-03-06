CREATE TABLE "task_result" ("id" SERIAL NOT NULL, "result" text NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "schedulerId" integer, CONSTRAINT "PK_623dd43986d67c74bad752b37a5" PRIMARY KEY ("id"));
ALTER TABLE "task_result" ADD CONSTRAINT "FK_b45df38118257e497e6792c6a1a" FOREIGN KEY ("schedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "secheduler" ADD "isSendMessage" boolean NOT NULL DEFAULT false;
CREATE TYPE "secheduler_casegrade_enum" AS ENUM('0', '1', '2');
ALTER TABLE "secheduler" ADD "caseGrade" "secheduler_casegrade_enum" NOT NULL DEFAULT '2';
CREATE TYPE "secheduler_tasktype_enum" AS ENUM('1', '2');
ALTER TABLE "secheduler" ADD "taskType" "secheduler_tasktype_enum" NOT NULL DEFAULT '1';
ALTER TABLE "catalog" DROP CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e";
CREATE TABLE "secheduler_catalogs_catalog" ("sechedulerId" integer NOT NULL, "catalogId" integer NOT NULL, CONSTRAINT "PK_040e10841c4ed6d74d501456611" PRIMARY KEY ("sechedulerId", "catalogId"));
CREATE INDEX "IDX_c8170a590fb4460220c9f2cae3" ON "secheduler_catalogs_catalog" ("sechedulerId");
CREATE INDEX "IDX_0b156f1316d0acaaf7310fc61b" ON "secheduler_catalogs_catalog" ("catalogId");
ALTER TABLE "catalog" ADD "schedulersId" integer;
ALTER TABLE "catalog" ADD CONSTRAINT "FK_f18cd600ff3e37b382de2cf3a4e" FOREIGN KEY ("platformCodeId") REFERENCES "platform_code"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog" ADD CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39" FOREIGN KEY ("schedulersId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "catalog" DROP CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39";
ALTER TABLE "catalog" ADD CONSTRAINT "FK_c635cb5baf1cb0575bf00ff2f39" FOREIGN KEY ("schedulersId") REFERENCES "secheduler"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
drop table secheduler_cases_case;
