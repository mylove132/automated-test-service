import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1576671935543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `bio` varchar(255) NOT NULL DEFAULT '', `image` varchar(255) NOT NULL DEFAULT '', `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `catalog` (`id` int NOT NULL AUTO_INCREMENT, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `parentId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `catalog_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_70d212d18fcba518deb2d85da6` (`id_ancestor`), INDEX `IDX_6dc3a4dee5cf7d8ee18e13d6c1` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `catalog` ADD CONSTRAINT `FK_025e7df89e01ff5b86e68b50e43` FOREIGN KEY (`parentId`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `catalog` ADD CONSTRAINT `FK_6b0daca4bde404abcf88f305f03` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `catalog_closure` ADD CONSTRAINT `FK_70d212d18fcba518deb2d85da68` FOREIGN KEY (`id_ancestor`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `catalog_closure` ADD CONSTRAINT `FK_6dc3a4dee5cf7d8ee18e13d6c1e` FOREIGN KEY (`id_descendant`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `catalog_closure` DROP FOREIGN KEY `FK_6dc3a4dee5cf7d8ee18e13d6c1e`");
        await queryRunner.query("ALTER TABLE `catalog_closure` DROP FOREIGN KEY `FK_70d212d18fcba518deb2d85da68`");
        await queryRunner.query("ALTER TABLE `catalog` DROP FOREIGN KEY `FK_6b0daca4bde404abcf88f305f03`");
        await queryRunner.query("ALTER TABLE `catalog` DROP FOREIGN KEY `FK_025e7df89e01ff5b86e68b50e43`");
        await queryRunner.query("DROP INDEX `IDX_6dc3a4dee5cf7d8ee18e13d6c1` ON `catalog_closure`");
        await queryRunner.query("DROP INDEX `IDX_70d212d18fcba518deb2d85da6` ON `catalog_closure`");
        await queryRunner.query("DROP TABLE `catalog_closure`");
        await queryRunner.query("DROP TABLE `catalog`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
