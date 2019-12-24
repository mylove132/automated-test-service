import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {RequestType} from './dto/http.enum';
import {CatalogEntity} from '../catalog/catalog.entity';
import {HistoryEntity} from '../history/history.entity';


@Entity('case')
export class CaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({comment: "用例名称"})
    name: string;

    @Column('json', {default: '{}', nullable: true, comment: '请求接口的header信息'})
    header: string;

    @Column('json', {default: '{}', nullable: true, comment: '请求接口的参数信息'})
    param: string;

    @Column({comment: '请求接口的url'})
    url: string;

    @Column('enum', {default: RequestType.GET, nullable:false, comment: '请求接口的类型', enum: RequestType})
    type: RequestType;

    @ManyToOne(type => CatalogEntity, catalog => catalog.cases)
    catalog: CatalogEntity;

    @OneToMany(type => HistoryEntity, history => history.case)
    histories: HistoryEntity[];

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
}
















































































































































































































































































































































































































































































































