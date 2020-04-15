ALTER TABLE "case" DROP CONSTRAINT "FK_c686adc17f1ec523275b1ddc995";
ALTER TABLE "secheduler" DROP COLUMN "taskType";
DROP TYPE "public"."secheduler_tasktype_enum";
ALTER TABLE "case" DROP COLUMN "caseType";
DROP TYPE "public"."case_casetype_enum";
ALTER TABLE "case" DROP COLUMN "sceneId";
DROP TABLE "scene";
