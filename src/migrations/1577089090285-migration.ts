import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1577089090285 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "parentId" integer, "userId" integer, CONSTRAINT "PK_782754bded12b4e75ad4afff913" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_90dcd7a98828d7c367e5675e9e3" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70d212d18fcba518deb2d85da6" ON "catalog_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_6dc3a4dee5cf7d8ee18e13d6c1" ON "catalog_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_025e7df89e01ff5b86e68b50e43" FOREIGN KEY ("parentId") REFERENCES "catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog" ADD CONSTRAINT "FK_6b0daca4bde404abcf88f305f03" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog_closure" ADD CONSTRAINT "FK_70d212d18fcba518deb2d85da68" FOREIGN KEY ("id_ancestor") REFERENCES "catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog_closure" ADD CONSTRAINT "FK_6dc3a4dee5cf7d8ee18e13d6c1e" FOREIGN KEY ("id_descendant") REFERENCES "catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "catalog_closure" DROP CONSTRAINT "FK_6dc3a4dee5cf7d8ee18e13d6c1e"`);
        await queryRunner.query(`ALTER TABLE "catalog_closure" DROP CONSTRAINT "FK_70d212d18fcba518deb2d85da68"`);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_6b0daca4bde404abcf88f305f03"`);
        await queryRunner.query(`ALTER TABLE "catalog" DROP CONSTRAINT "FK_025e7df89e01ff5b86e68b50e43"`);
        await queryRunner.query(`DROP INDEX "IDX_6dc3a4dee5cf7d8ee18e13d6c1"`);
        await queryRunner.query(`DROP INDEX "IDX_70d212d18fcba518deb2d85da6"`);
        await queryRunner.query(`DROP TABLE "catalog_closure"`);
        await queryRunner.query(`DROP TABLE "catalog"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
