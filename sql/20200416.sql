CREATE TABLE "task_result" ("id" SERIAL NOT NULL, "result" text NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "schedulerId" integer, CONSTRAINT "PK_623dd43986d67c74bad752b37a5" PRIMARY KEY ("id"));
ALTER TABLE "task_result" ADD CONSTRAINT "FK_b45df38118257e497e6792c6a1a" FOREIGN KEY ("schedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "secheduler" ADD "isSendMessage" boolean NOT NULL DEFAULT false;
CREATE TYPE "secheduler_casegrade_enum" AS ENUM('0', '1', '2');
ALTER TABLE "secheduler" ADD "caseGrade" "secheduler_casegrade_enum" NOT NULL DEFAULT '2';
CREATE TYPE "secheduler_tasktype_enum" AS ENUM('1', '2');
ALTER TABLE "secheduler" ADD "taskType" "secheduler_tasktype_enum" NOT NULL DEFAULT '1';
