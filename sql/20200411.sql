ALTER TABLE "scene" DROP COLUMN "dependenceCaseJson";
ALTER TABLE "case" DROP COLUMN "isDependenceParam"
ALTER TABLE "case" ADD "sceneId" integer;
ALTER TABLE "catalog" ALTER COLUMN "parentId" SET DEFAULT null;
ALTER TABLE "case" ADD CONSTRAINT "FK_c686adc17f1ec523275b1ddc995" FOREIGN KEY ("sceneId") REFERENCES "scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;
