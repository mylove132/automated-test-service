INSERT INTO "assert_judge" (id,name) VALUES ((SELECT max(id) FROM "assert_judge")+1,'为空');
INSERT INTO "assert_judge" (id,name) VALUES ((SELECT max(id) FROM "assert_judge")+1,'不为空');
ALTER TABLE "case" ADD "isNeedSign" boolean NOT NULL DEFAULT false;
