import {Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {EndpointEntity} from './endpoint.entity';
import {CaselistEntity} from '../caselist/caselist.entity';
import {SchedulerEntity} from '../task/scheduler.entity';
import {TokenEntity} from "../token/token.entity";

@Entity('env')
export class EnvEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => EndpointEntity, endpoint => endpoint.envs)
    endpoints: EndpointEntity[];


    @OneToMany(type => CaselistEntity, caseList => caseList.env)
    caseLists: CaselistEntity[]

    @OneToOne(type => SchedulerEntity, secheduler => secheduler.env)
    sechedulers: SchedulerEntity[];

    @OneToMany(type => TokenEntity,tokens => tokens.env)
    tokens: TokenEntity[]

}
