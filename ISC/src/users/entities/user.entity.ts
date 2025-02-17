import { ProfileEntity } from "src/profile/entities/profile.entity";
import { ScheduleStopEntity } from "src/schedule-stop/entities/schedule-stop.entity";
import { NoScheduleStopEntity } from "src/no-schedule-stop/entities/no-schedule-stop.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(_type => ProfileEntity)
    @JoinColumn({name: 'profile_id'})
    profile!: ProfileEntity;

    @Column()
    users_justify: number;

    @Column()
    users_delete: boolean;

    @OneToMany(() => ScheduleStopEntity, (models) => models.user)
    schedule_stop!: ScheduleStopEntity[];

    @OneToMany(() => NoScheduleStopEntity, (models) => models.user)
    no_schedule_stop!: NoScheduleStopEntity[];

}