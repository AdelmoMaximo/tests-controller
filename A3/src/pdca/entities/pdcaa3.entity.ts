import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PdcaEntity } from "./pdca.entity";
import { a3_registryEntity } from "src/registry/entities/a3_registry.entity";
import { a3_notifyEntity } from "src/notify/entities/notify.entity";

@Entity('PDCAA3')
export class PdcaA3Entity{
    @PrimaryGeneratedColumn()
    pdcaa3_id:number;

    @Column()
    a3_registry_id:number;

    @Column('float',{precision:53})
    pdcaa3_status:number;

    @ManyToOne(() => a3_registryEntity,(registry) => registry.pdcaA3)
    @JoinColumn({name:'a3_registry_id'})
    registry: a3_registryEntity;

    @OneToMany(() => PdcaEntity, (Pdca) => Pdca.pdcaA3)
    pdca!: PdcaEntity[];

    @OneToMany(() => a3_notifyEntity, (notify) => notify.pdcaa3)
    notifications!: a3_notifyEntity[];

    @Column()
    pdcaa3_last_modified:Date;

    @Column()
    pdcaa3_is_close:boolean;

    @Column()
    pdcaa3_justification:string;

    @Column()
    pdcaa3_solved:number;

    @Column()
    pdcaa3_opened:number;

    @Column()
    pdcaa3_canceled:boolean;
}