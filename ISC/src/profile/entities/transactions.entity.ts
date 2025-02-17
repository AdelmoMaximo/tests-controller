import { ProfileEntity } from "src/profile/entities/profile.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TRANSACTIONS')
export class TransactionsEntity{
    @PrimaryGeneratedColumn()
    transactions_id:number;

    @Column()
    transactions_cod:number;

    @Column()
    transactions_url:string;

    @Column()
    transactions_description:string;

    @Column()
    transactions_status:boolean;

    @Column()
    profile_id:number;

    @ManyToOne(() => ProfileEntity, (profile) => profile.transactions)
    @JoinColumn({name: 'profile_id'})
    profile:ProfileEntity;
}