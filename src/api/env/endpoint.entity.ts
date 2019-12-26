import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {EnvEntity} from './env.entity';
import {CaseEntity} from '../case/case.entity';
@Unique(['endpoint'])
@Entity('endpoint')
export class EndpointEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    endpoint: string;

    @ManyToMany(type => EnvEntity, env => env.endpoints, {cascade: true})
    @JoinTable()
    envs: EnvEntity[];

    @OneToMany(type => CaseEntity, cas => cas.endpointObject)
    cases: CaseEntity[];
}
