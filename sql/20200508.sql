ALTER TABLE "case" DROP CONSTRAINT "FK_7bedaea7848005f61a37b1fe254";
ALTER TABLE "case" DROP COLUMN "jmeterId";
ALTER TABLE "case" ALTER COLUMN "assertText" DROP NOT NULL;
COMMENT ON COLUMN "case"."assertText" IS '断言内容';
ALTER TABLE "case" ADD "isRealDelete" boolean NOT NULL DEFAULT false;