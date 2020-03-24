import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {OperateEntity} from "../operate/operate.entity";

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({unique: true})
  userId: number;

  @OneToMany(type => OperateEntity, operates => operates.user)
  operates: OperateEntity[];
}
