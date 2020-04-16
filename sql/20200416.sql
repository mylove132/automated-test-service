CREATE TABLE "task_result" ("id" SERIAL NOT NULL, "result" text NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "schedulerId" integer, CONSTRAINT "PK_623dd43986d67c74bad752b37a5" PRIMARY KEY ("id"));
ALTER TABLE "task_result" ADD CONSTRAINT "FK_b45df38118257e497e6792c6a1a" FOREIGN KEY ("schedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "secheduler" ADD "isSendMessage" boolean NOT NULL DEFAULT false;
