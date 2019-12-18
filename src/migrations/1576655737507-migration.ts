import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1576655737507 implements MigrationInterface {
    name = 'migration1576655737507'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `permission` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `action` varchar(255) NOT NULL, `identify` varchar(255) NOT NULL, UNIQUE INDEX `IDX_d72702dfdfa985f6681d9b4426` (`identify`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `personal_permission` (`id` int NOT NULL AUTO_INCREMENT, `status` varchar(255) NOT NULL, `userId` int NULL, `permissionId` int NULL, UNIQUE INDEX `REL_45604c7db5e2386da1a91b8c86` (`permissionId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NULL, `email` varchar(255) NULL, `mobile` varchar(255) NULL, `password` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `IDX_29fd51e9cf9241d022c5a4e02e` (`mobile`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `catalog` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `parentId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `role_permissions_permission` (`roleId` int NOT NULL, `permissionId` int NOT NULL, INDEX `IDX_b36cb2e04bc353ca4ede00d87b` (`roleId`), INDEX `IDX_bfbc9e263d4cea6d7a8c9eb3ad` (`permissionId`), PRIMARY KEY (`roleId`, `permissionId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user_roles_role` (`userId` int NOT NULL, `roleId` int NOT NULL, INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`), INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `catalog_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_70d212d18fcba518deb2d85da6` (`id_ancestor`), INDEX `IDX_6dc3a4dee5cf7d8ee18e13d6c1` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `personal_permission` ADD CONSTRAINT `FK_cb2db392d072d8323b48fed53a4` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `personal_permission` ADD CONSTRAINT `FK_45604c7db5e2386da1a91b8c860` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `catalog` ADD CONSTRAINT `FK_025e7df89e01ff5b86e68b50e43` FOREIGN KEY (`parentId`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `catalog` ADD CONSTRAINT `FK_6b0daca4bde404abcf88f305f03` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `role_permissions_permission` ADD CONSTRAINT `FK_b36cb2e04bc353ca4ede00d87b9` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `role_permissions_permission` ADD CONSTRAINT `FK_bfbc9e263d4cea6d7a8c9eb3ad2` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `catalog_closure` ADD CONSTRAINT `FK_70d212d18fcba518deb2d85da68` FOREIGN KEY (`id_ancestor`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `catalog_closure` ADD CONSTRAINT `FK_6dc3a4dee5cf7d8ee18e13d6c1e` FOREIGN KEY (`id_descendant`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `catalog_closure` DROP FOREIGN KEY `FK_6dc3a4dee5cf7d8ee18e13d6c1e`", undefined);
        await queryRunner.query("ALTER TABLE `catalog_closure` DROP FOREIGN KEY `FK_70d212d18fcba518deb2d85da68`", undefined);
        await queryRunner.query("ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_4be2f7adf862634f5f803d246b8`", undefined);
        await queryRunner.query("ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_5f9286e6c25594c6b88c108db77`", undefined);
        await queryRunner.query("ALTER TABLE `role_permissions_permission` DROP FOREIGN KEY `FK_bfbc9e263d4cea6d7a8c9eb3ad2`", undefined);
        await queryRunner.query("ALTER TABLE `role_permissions_permission` DROP FOREIGN KEY `FK_b36cb2e04bc353ca4ede00d87b9`", undefined);
        await queryRunner.query("ALTER TABLE `catalog` DROP FOREIGN KEY `FK_6b0daca4bde404abcf88f305f03`", undefined);
        await queryRunner.query("ALTER TABLE `catalog` DROP FOREIGN KEY `FK_025e7df89e01ff5b86e68b50e43`", undefined);
        await queryRunner.query("ALTER TABLE `personal_permission` DROP FOREIGN KEY `FK_45604c7db5e2386da1a91b8c860`", undefined);
        await queryRunner.query("ALTER TABLE `personal_permission` DROP FOREIGN KEY `FK_cb2db392d072d8323b48fed53a4`", undefined);
        await queryRunner.query("DROP INDEX `IDX_6dc3a4dee5cf7d8ee18e13d6c1` ON `catalog_closure`", undefined);
        await queryRunner.query("DROP INDEX `IDX_70d212d18fcba518deb2d85da6` ON `catalog_closure`", undefined);
        await queryRunner.query("DROP TABLE `catalog_closure`", undefined);
        await queryRunner.query("DROP INDEX `IDX_4be2f7adf862634f5f803d246b` ON `user_roles_role`", undefined);
        await queryRunner.query("DROP INDEX `IDX_5f9286e6c25594c6b88c108db7` ON `user_roles_role`", undefined);
        await queryRunner.query("DROP TABLE `user_roles_role`", undefined);
        await queryRunner.query("DROP INDEX `IDX_bfbc9e263d4cea6d7a8c9eb3ad` ON `role_permissions_permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_b36cb2e04bc353ca4ede00d87b` ON `role_permissions_permission`", undefined);
        await queryRunner.query("DROP TABLE `role_permissions_permission`", undefined);
        await queryRunner.query("DROP TABLE `catalog`", undefined);
        await queryRunner.query("DROP INDEX `IDX_29fd51e9cf9241d022c5a4e02e` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
        await queryRunner.query("DROP INDEX `REL_45604c7db5e2386da1a91b8c86` ON `personal_permission`", undefined);
        await queryRunner.query("DROP TABLE `personal_permission`", undefined);
        await queryRunner.query("DROP INDEX `IDX_ae4578dcaed5adff96595e6166` ON `role`", undefined);
        await queryRunner.query("DROP TABLE `role`", undefined);
        await queryRunner.query("DROP INDEX `IDX_d72702dfdfa985f6681d9b4426` ON `permission`", undefined);
        await queryRunner.query("DROP TABLE `permission`", undefined);
    }

}
