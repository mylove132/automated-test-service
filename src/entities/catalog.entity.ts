import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Tree("closure-table")
export class Catalog {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @TreeParent()
  parent: Catalog;

  @TreeChildren()
  children: Catalog[];

  @ManyToOne(type => User,user => user.catalogs,{
    onDelete:'CASCADE'
  })
  @JoinTable()
  user: User;
}
