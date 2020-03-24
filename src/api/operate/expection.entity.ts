import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import {UserEntity} from "../user/user.entity";
@Entity('exception')
export class ExceptionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @ManyToOne(type => UserEntity, user => user.operates, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    user: UserEntity;

    //请求参数
    @Column('text',{})
    requestParam: string;

    @Column('text',{})
    exceptionMsg: string;

    @Column()
    requestIp: string;
}
