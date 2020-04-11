insert into "public"."assert_judge" ( "id","name") values ((select max(id) from "public"."assert_judge")+1,'为空');
insert into "public"."assert_judge" ( "id","name") values ((select max(id) from "public"."assert_judge")+1,'不为空');
ALTER TABLE "case" ADD "isNeedSign" boolean NOT NULL DEFAULT false;
