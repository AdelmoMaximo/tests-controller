import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Process_Month')
export class Report_Month{
    @PrimaryGeneratedColumn()
    seqNum:number;

    @Column()
    dateYYYYMM:number;

    @Column()
    modelID:number;

    @Column()
    processID:number;

    @Column()
    monthTotal:number;
    
}