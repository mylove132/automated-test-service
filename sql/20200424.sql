ALTER TABLE "case" ADD "jmeterId" integer;
ALTER TABLE "jmeter" ADD "md5" character varying NOT NULL;
ALTER TABLE "jmeter" ADD CONSTRAINT "UQ_d4dbc9ae055488e899c08a22b98" UNIQUE ("md5");
ALTER TABLE "case" ADD CONSTRAINT "FK_7bedaea7848005f61a37b1fe254" FOREIGN KEY ("jmeterId") REFERENCES "jmeter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
