CREATE TYPE "scene_scenegrade_enum" AS ENUM('0', '1', '2');
ALTER TABLE "scene" ADD "sceneGrade" "scene_scenegrade_enum" NOT NULL DEFAULT '2';
ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "history" ALTER COLUMN "startTime" SET DEFAULT '"2020-03-17T23:02:29.910Z"';
ALTER TABLE "history" ALTER COLUMN "endTime" SET DEFAULT '"2020-03-17T23:02:29.910Z"';