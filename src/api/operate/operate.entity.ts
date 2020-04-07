import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import {UserEntity} from "../user/user.entity";
import { OperateType,OperateModule } from "../../config/base.enum";
@Entity('operate')
export class OperateEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @ManyToOne(type => UserEntity, user => user.operates, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    user: UserEntity;

    //操作模块
  @Column('enum', {default: OperateModule.CASE, nullable:false, comment: '操作模块', enum: OperateModule})
    operateModule: OperateModule;

    //操作类型
    @Column('enum', {default: OperateType.CREAT, nullable:false, comment: '操作类型', enum: OperateType})
    operateType: OperateType;

    //操作描述
    @Column({nullable: true})
    operateDesc: string;

    //请求参数
    @Column('text',{})
    requestParam: string;

    //返回参数
    @Column('text',{})
    responseParam: string;

    @Column()
    operateUri: string;

    @Column()
    operateIp: string;
}
