import {Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {EndpointEntity} from './endpoint.entity';
import {CaselistEntity} from '../caselist/caselist.entity';
import {SchedulerEntity} from '../task/scheduler.entity';

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
    secheduler: SchedulerEntity;
}
