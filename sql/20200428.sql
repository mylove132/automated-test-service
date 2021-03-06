ALTER TABLE "jmeter" ADD "remote_address" character varying;
CREATE TYPE "jmeter_result_jmeterrunstatus_enum" AS ENUM('1', '2', '3', '4');
ALTER TABLE "jmeter_result" ADD "jmeterRunStatus" "jmeter_result_jmeterrunstatus_enum" NOT NULL DEFAULT '4';
ALTER TABLE "jmeter" RENAME COLUMN "md5" TO "url";
ALTER TABLE "jmeter" RENAME CONSTRAINT "UQ_d4dbc9ae055488e899c08a22b98" TO "UQ_0ed12ba15fb81cb7cf434381406";
ALTER TABLE "jmeter" DROP CONSTRAINT "UQ_0ed12ba15fb81cb7cf434381406";
ALTER TABLE "jmeter" ADD "url" string;
ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1";
ALTER TABLE "secheduler_catalogs_catalog" DROP CONSTRAINT "FK_c8170a590fb4460220c9f2cae30";
ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_c8170a590fb4460220c9f2cae30" FOREIGN KEY ("sechedulerId") REFERENCES "secheduler"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "secheduler_catalogs_catalog" ADD CONSTRAINT "FK_0b156f1316d0acaaf7310fc61b1" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "jmeter_result" ADD "md5" character varying NOT NULL;
ALTER TABLE "jmeter_result" ADD CONSTRAINT "UQ_6251fb638bf86ca80458c302844" UNIQUE ("md5");

