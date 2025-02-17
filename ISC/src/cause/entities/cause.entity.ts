import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SoluctionCauseEntity } from "./soluction-cause.entity";
import { DefectCauseEntity } from "src/defect/entities/defect-cause.entity";

@Entity('CAUSE')
export class CauseEntity{

    @PrimaryGeneratedColumn()
    cause_id: number;

    @Column()
    cause_description:string;

    @Column()
    cause_created_at:Date;

    @OneToMany(() => SoluctionCauseEntity, (soluction) => soluction.cause)
    soluctions!: SoluctionCauseEntity[];

    @OneToMany(() => DefectCauseEntity, (defect) => defect.cause)
    defects!: DefectCauseEntity[];
}