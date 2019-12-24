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

  @Column({default: false})
  isPub: boolean;

  @Column({default: null, nullable: true})
  parentId: number;

  @ManyToOne(type => UserEntity, user => user.catalogs)
  user: UserEntity;

  children: CatalogEntity[];
}
