import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {EndpointEntity} from './endpoint.entity';
import {CaselistEntity} from '../caselist/caselist.entity';

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
}
