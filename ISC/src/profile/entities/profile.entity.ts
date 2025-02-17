import { TransactionsEntity } from "src/profile/entities/transactions.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('PROFILE')
export class ProfileEntity{
    @PrimaryGeneratedColumn()
    profile_id:number;

    @Column()
    profile_name:string;

    @Column()
    profile_create_date:Date;

    @Column()
    profile_status:boolean;

    @OneToMany(() => TransactionsEntity, (transactions) => transactions.profile)
    
    transactions!: TransactionsEntity[];
}