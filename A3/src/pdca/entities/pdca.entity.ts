import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { a3_causeEntity } from "src/cause/entities/a3_cause.entity";
import { PdcaA3Entity } from "./pdcaa3.entity";

@Entity('PDCA')
export class PdcaEntity{
    @PrimaryGeneratedColumn()
    pdca_id:number;

    @Column()
    pdca_what:string;

    @Column()
    pdca_why:string;

    @Column()
    pdca_where:string;

    @Column()
    pdca_when:Date;

    @Column()
    pdca_when_end:Date;

    @Column()
    pdca_last_modified:Date;

    @Column()
    user_id:number;

    @Column()
    pdca_how:string;

    @Column('float',{precision:53})
    pdca_how_much:number;

    @Column()
    a3_cause_id:number;

    @Column()
    pdcaa3_id:number;

    @ManyToOne(() => UserEntity,(user) => user.pdca)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @ManyToOne(() => a3_causeEntity,(cause) => cause.pdca)
    @JoinColumn({name:'a3_cause_id'})
    cause: a3_causeEntity;

    @ManyToOne(() => PdcaA3Entity,(pdca) => pdca.pdca)
    @JoinColumn({name:'pdcaa3_id'})
    pdcaA3: PdcaA3Entity;
}