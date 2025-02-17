import { SoluctionCauseEntity } from "src/cause/entities/soluction-cause.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('SOLUCTION')
export class SoluctionEntity{

    @PrimaryGeneratedColumn()
    soluction_id: number;

    @Column()
    soluction_description:string;

    @Column()
    soluction_created_at:Date;

    @OneToMany(() => SoluctionCauseEntity, (soluction) => soluction.soluctions)
    
    soluctionCauses!: SoluctionCauseEntity[];
}