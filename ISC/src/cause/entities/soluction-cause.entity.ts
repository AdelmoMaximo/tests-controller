import { SoluctionEntity } from "src/solution/entities/soluction.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CauseEntity } from "./cause.entity";

@Entity('SOLUCTION_CAUSE')
export class SoluctionCauseEntity{

    @PrimaryGeneratedColumn()
    soluction_cause_id: number;

    @Column()
    soluction_id:number;

    @Column()
    cause_id:number;
    
    @ManyToOne(() => SoluctionEntity, (soluction) => soluction.soluctionCauses)
    @JoinColumn({name: 'soluction_id'})
    soluctions:SoluctionEntity;

    @ManyToOne(() => CauseEntity, (cause) =>cause.soluctions)
    @JoinColumn({name: 'cause_id'})
    cause:CauseEntity;
}