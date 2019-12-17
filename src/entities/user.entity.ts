import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Role } from './role.entity';
import { PersonalPermission } from './personal-permission.entity';
import moment = require('moment');
import { Catalog } from './catalog.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true
  })
  username: string;

  @Column({
    unique: true,
    nullable: true
  })
  email: string;

  @Column({
    unique: true,
    nullable: true
  })
  mobile: string;

  @Column()
  password: string;

  @OneToMany(type => Catalog, catalog => catalog.user)
  catalogs: Catalog[];

  @ManyToMany(type => Role, role => role.users, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  roles: Role[];

  @OneToMany(type => PersonalPermission, personalPermission => personalPermission.user)
  personalPermissions: PersonalPermission[];


  @CreateDateColumn({
    transformer: {
      from: (date: Date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      to: () => {
        return new Date();
      }
    }
  })
  createdAt: string;

  @UpdateDateColumn({
    transformer: {
      from: (date: Date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      to: () => {
        return new Date();
      }
    }
  })
  updatedAt: string;
}
