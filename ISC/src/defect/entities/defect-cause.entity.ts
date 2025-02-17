import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DefectEntity } from "./defect.entity";
import { CauseEntity } from "src/cause/entities/cause.entity";

@Entity('defect_cause')
export class DefectCauseEntity{

    @PrimaryGeneratedColumn()
    defect_cause_id: number;

    @Column()
    defect_id:number;

    @Column()
    cause_id:number;

    @ManyToOne(() => DefectEntity, (defect) => defect.defects)
    @JoinColumn({name: 'defect_id'})
    defect:DefectEntity;

    @ManyToOne(() => CauseEntity, (cause) => cause.defects)
    @JoinColumn({name: 'cause_id'})
    cause:CauseEntity;
}