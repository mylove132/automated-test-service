ALTER TABLE "catalog" ADD "isRealDelete" boolean NOT NULL DEFAULT false;
CREATE TABLE "secheduler_jmeters_jmeter" ("sechedulerId" integer NOT NULL, "jmeterId" integer NOT NULL, CONSTRAINT "PK_3d9dc4359bac1e8e7c322ad55e2" PRIMARY KEY ("sechedulerId", "jmeterId"));
CREATE INDEX "IDX_a29303d44d2ec915b729867783" ON "secheduler_jmeters_jmeter" ("sechedulerId");
CREATE INDEX "IDX_9bb621395da4b2f0a09902b8a6" ON "secheduler_jmeters_jmeter" ("jmeterId");
ALTER TABLE "catalog" ADD "isRealDelete" boolean NOT NULL DEFAULT false;
ALTER TABLE "secheduler_jmeters_jmeter" ADD CONSTRAINT "FK_a29303d44d2ec915b729867783c" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "secheduler_jmeters_jmeter" ADD CONSTRAINT "FK_9bb621395da4b2f0a09902b8a61" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE SET NULL ON UPDATE NO ACTION;