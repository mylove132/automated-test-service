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

    @Column()
    uri: string;

    //异常名称
    @Column()
    excName: string;

    //请求参数
    @Column('text',{})
    requestParam: string;

    @Column('text',{})
    exceptionMsg: string;

    @Column({nullable: true})
    errorCode: number;

    @Column()
    requestIp: string;
}
