import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  TreeChildren, TreeParent, Tree
} from 'typeorm';
import {UserEntity} from "../user/user.entity";

@Tree("closure-table")
@Entity('catalog')
export class CatalogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column()
  name: string;

  @TreeChildren()
  children: CatalogEntity[];

  @TreeParent()
  parent: CatalogEntity;

  @ManyToOne(type => UserEntity, user => user.catalogs)
  user: UserEntity;
}
