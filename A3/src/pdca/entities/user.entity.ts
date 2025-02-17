import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PdcaEntity } from "./pdca.entity";

@Entity('USERS')
export class UserEntity{

    @PrimaryGeneratedColumn()
    users_id: number;

    @Column()
    users_status: boolean;

    @Column()
    users_name:string;

    @Column()
    users_email:string;

    @Column()
    users_password:string;

    @Column()
    profile_id:number;

    @Column({
        nullable:true
    })
    users_token:string;

    @Column()
    count_tries:number;

    @Column()
    users_create_date:Date;

    @Column()
    users_login:string;

    @Column()
    users_permissions:string;

    @Column()
    users_create:string;

    // @Column()
    // shifts_id:number;

    @Column()
    users_update_data:Date;

    @Column()
    user_update_user:string;

    @Column()
    users_justify: number;

    @Column()
    users_delete: boolean;

    @OneToMany(() => PdcaEntity, (Pdca) => Pdca.user)
    pdca!: PdcaEntity[];

    @Column()
    users_is_on:boolean;
}