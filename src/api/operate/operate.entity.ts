import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import {UserEntity} from "../user/user.entity";
import {CaseEntity} from '../case/case.entity';
import {SceneEntity} from "../scene/scene.entity";
@Entity('operate')
export class OperateEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @ManyToOne(type => UserEntity, user => user.operates, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    user: UserEntity;

    //操作模块
    @Column()
    operateModule: string;

    //操作类型
    @Column()
    operateType: string;

    //操作描述
    @Column()
    operateDesc: string;

    //请求参数
    @Column('text',{})
    requestParam: string;

    //返回参数
    @Column('text',{})
    responseParam: string;

    @Column()
    operateName: string;

    @Column()
    operateUri: string;

    @Column()
    operateIp: string;
}
