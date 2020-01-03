import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { CatalogEntity} from "../catalog/catalog.entity";

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({unique: true})
  userId: number;

  @OneToMany(type => CatalogEntity, catalog  => catalog.user)
  catalogs: CatalogEntity[];

}
