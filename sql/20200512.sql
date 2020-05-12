ALTER TABLE "catalog" ADD "isRealDelete" boolean NOT NULL DEFAULT false;
CREATE TABLE "secheduler_jmeters_jmeter" ("sechedulerId" integer NOT NULL, "jmeterId" integer NOT NULL, CONSTRAINT "PK_3d9dc4359bac1e8e7c322ad55e2" PRIMARY KEY ("sechedulerId", "jmeterId"));
CREATE INDEX "IDX_a29303d44d2ec915b729867783" ON "secheduler_jmeters_jmeter" ("sechedulerId");
CREATE INDEX "IDX_9bb621395da4b2f0a09902b8a6" ON "secheduler_jmeters_jmeter" ("jmeterId");
ALTER TABLE "catalog" ADD "isRealDelete" boolean NOT NULL DEFAULT false;
ALTER TABLE "secheduler_jmeters_jmeter" ADD CONSTRAINT "FK_a29303d44d2ec915b729867783c" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "secheduler_jmeters_jmeter" ADD CONSTRAINT "FK_9bb621395da4b2f0a09902b8a61" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

CREATE TABLE "dyn_sql" ("id" SERIAL NOT NULL, "sql" character varying NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "dynDbId" integer, CONSTRAINT "PK_3893ccb87f7af00775e8d00b86a" PRIMARY KEY ("id"));
CREATE TABLE "dyn_db" ("id" SERIAL NOT NULL, "dbName" character varying NOT NULL, "dbHost" character varying NOT NULL, "dbPort" integer NOT NULL, "dbUsername" character varying NOT NULL, "dbPassword" character varying NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5ab0b60fcd14b126d4e5224b991" PRIMARY KEY ("id"));

ALTER TABLE "dyn_sql" ADD CONSTRAINT "FK_8b46a34e1828dc194130c9d8d43" FOREIGN KEY ("dynDbId") REFERENCES "dyn_db"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "dyn_sql" ADD "resultFields" character varying NOT NULL;