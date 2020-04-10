import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from "typeorm";
import {CaseGrade, CaseType, ParamType, RequestType} from '../../config/base.enum';
import {CatalogEntity} from '../catalog/catalog.entity';
import {HistoryEntity} from '../history/history.entity';
import {EndpointEntity} from '../env/endpoint.entity';
import {AssertJudgeEntity, AssertTypeEntity} from "./assert.entity";
import {SchedulerEntity} from "../task/scheduler.entity";
import {CaselistEntity} from "../caselist/caselist.entity";
import {TokenEntity} from "../token/token.entity";

@Unique(['alias'])
@Entity('case')
export class CaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({comment: "用例名称"})
    name: string;

    @Column('json', {default: '{}', nullable: true, comment: '请求接口的header信息'})
    header: string;

    @Column({nullable: true, comment: '请求接口的参数信息'})
    param: string;

    @Column('enum',{default: ParamType.TEXT, nullable: false, enum: ParamType, comment: '参数类型'})
    paramType: ParamType;

    @Column('enum',{default: CaseGrade.LOW, nullable: false, enum: CaseGrade, comment: '用例等级'})
    caseGrade: CaseGrade;

    @Column('enum',{default: CaseType.SINGLE, nullable: false, enum: CaseType, comment: '用例类别'})
    caseType: CaseType;

    @Column({comment: '请求接口的路径'})
    path: string;

    @Column({comment: '请求接口的前缀'})
    endpoint: string;

    @Column('enum', {default: RequestType.GET, nullable:false, comment: '请求接口的类型', enum: RequestType})
    type: RequestType;

    @ManyToOne(type => CatalogEntity, catalog => catalog.cases, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    catalog: CatalogEntity;

    @OneToMany(type => HistoryEntity, history => history.case)
    histories: HistoryEntity[];

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @ManyToOne(type => AssertTypeEntity, assert => assert.cases, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    assertType: AssertTypeEntity;

    @ManyToOne(type => AssertJudgeEntity, assertJudge => assertJudge.cases, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    assertJudge: AssertJudgeEntity;

    @Column({comment: '断言内容'})
    assertText: string;

    @Column({name:'assertKey',nullable:true,comment: '断言key值'})
    assertKey: string;

    @ManyToMany(type => CaselistEntity, caselist => caselist.cases,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    @JoinTable()
    caseLists: CaselistEntity[];

    @ManyToOne(type => EndpointEntity, endpoint => endpoint.cases,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    endpointObject: EndpointEntity;

    @Column({default: false})
    isNeedToken: boolean;

    @Column({default: false})
    isFailNotice: boolean;

    @Column({default: false})
    isNeedSign: boolean;

    //返回值别名
    @Column({nullable: true})
    alias: string;


    @Column({default: false})
    isDependenceParam: boolean;

    @ManyToMany(type => SchedulerEntity, secheduler => secheduler.cases)
    sechedulers: SchedulerEntity[];


    @ManyToOne(type => TokenEntity, token => token.cases,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    token: TokenEntity;

    // @ManyToMany(type => SceneEntity, scenes => scenes.cases,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    // @JoinTable()
    // scenes: SceneEntity[];

}
















































































































































































































































































































































































































































































































