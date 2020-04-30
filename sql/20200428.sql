ALTER TABLE "jmeter" ADD "remote_address" character varying;
CREATE TYPE "jmeter_result_jmeterrunstatus_enum" AS ENUM('1', '2', '3', '4');
ALTER TABLE "jmeter_result" ADD "jmeterRunStatus" "jmeter_result_jmeterrunstatus_enum" NOT NULL DEFAULT '4';