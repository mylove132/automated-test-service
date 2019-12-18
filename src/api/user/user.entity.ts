import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany} from "typeorm";
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';
import { CatalogEntity} from "../catalog/catalog.entity";

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @OneToMany(type => CatalogEntity, catalog  => catalog.user)
  catalogs: CatalogEntity[];

}
