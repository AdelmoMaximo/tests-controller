import { lineEntity } from "src/line/entities/line.entity";
import { ModelsComponentEntity } from "src/models/entities/models-component.entity";
import { ShiftEntity } from "src/shifts/entities/shift.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity , JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('SCHEDULED_STOP')
export class ScheduleStopEntity{
    @PrimaryGeneratedColumn()
    scheduled_stop_id:number;

    @Column()
    scheduled_stop_description:string;

    @Column()
    scheduled_stop_shifts_id: number;

    @ManyToOne(() => ShiftEntity, (shift) => shift.schedule_stop)
    @JoinColumn({name: 'scheduled_stop_shifts_id'})
    shift:ShiftEntity;
    
    @Column()
    scheduled_stop_type:string;

    @Column()
    scheduled_stop_status:number;

    @Column()
    scheduled_stop_is_actvie: boolean;

    @Column()
    scheduled_stop_date:Date;

    @Column()
    scheduled_stop_date_created:Date;

    @Column()
    scheduled_stop_users_update_data:Date;

    @Column()
    scheduled_stop_users_update:String;

    @Column()
    scheduled_stop_users_created:string;

    @Column()
    scheduled_stop_registration_line_id:number;

    @ManyToOne(() => lineEntity, (line) => line.schedule_stop)
    @JoinColumn({name: 'scheduled_stop_registration_line_id'})
    line:lineEntity;

    @Column()
    scheduled_stop_users_id:number;

    @ManyToOne(() => UserEntity, (user) => user.schedule_stop)
    @JoinColumn({name: 'scheduled_stop_users_id'})
    user:UserEntity;

    @Column()
    scheduled_stop_code:string;

    @Column()
    scheduled_stop_estimated_time:Date;

    @Column()
    scheduled_stop_justify: string;

    @Column()
    scheduled_stop_tempo_real:Date;

    @Column()
    scheduled_stop_acao_executada:string;

    @Column()
    scheduled_stop_causa_identificada:string;
}