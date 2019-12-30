import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  TreeChildren, TreeParent, Tree, OneToMany
} from 'typeorm';
import {UserEntity} from "../user/user.entity";
import {CaseEntity} from '../case/case.entity';

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

  @ManyToOne(type => UserEntity, user => user.catalogs, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
  user: UserEntity;

  @OneToMany(type => CaseEntity, cases => cases.catalog)
  cases: CaseEntity[];
}
