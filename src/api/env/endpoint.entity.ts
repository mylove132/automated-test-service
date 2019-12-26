import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {EnvEntity} from './env.entity';

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
}
