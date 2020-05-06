ALTER TABLE "jmeter" ADD "remote_address" character varying;
CREATE TYPE "jmeter_result_jmeterrunstatus_enum" AS ENUM('1', '2', '3', '4');
ALTER TABLE "jmeter_result" ADD "jmeterRunStatus" "jmeter_result_jmeterrunstatus_enum" NOT NULL DEFAULT '4';
ALTER TABLE "jmeter" RENAME COLUMN "md5" TO "url";
ALTER TABLE "jmeter" RENAME CONSTRAINT "UQ_d4dbc9ae055488e899c08a22b98" TO "UQ_0ed12ba15fb81cb7cf434381406";
ALTER TABLE "jmeter" DROP CONSTRAINT "UQ_0ed12ba15fb81cb7cf434381406";
ALTER TABLE "jmeter" ADD "url" string;