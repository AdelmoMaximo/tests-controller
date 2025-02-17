import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DefectCauseEntity } from "./defect-cause.entity";

@Entity('defect')
export class DefectEntity{
    @PrimaryGeneratedColumn()
    defect_id: number;

    @Column()
    defect_description:string;
    
    @Column()
    defect_code:string;
    
    @OneToMany(() => DefectCauseEntity, (defect) => defect.defect)
    defects!: DefectCauseEntity[];
}