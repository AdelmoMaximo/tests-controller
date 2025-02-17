import { Column, Entity , JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeviceEntity } from "src/device/entities/device.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { lineEntity } from "src/line/entities/line.entity";
import { ShiftEntity } from "src/shifts/entities/shift.entity";
import { ModelsEntity } from "src/models/entities/models.entity";


@Entity('NO_SCHEDULED_STOP')
export class NoScheduleStopEntity{
    @PrimaryGeneratedColumn()
    no_scheduled_stop_id:number;

    @Column()
    no_scheduled_stop_type:string;

    @Column()
    shifts_id:number;

    @ManyToOne(() => ShiftEntity, (shift) => shift.no_schedule_stop)
    @JoinColumn({name: 'shifts_id'})
    shift:ShiftEntity;

    @Column()
    no_scheduled_stop_date:Date;

    @Column()
    registration_line_id:number;

    @ManyToOne(() => lineEntity, (line) => line.no_schedule_stop)
    @JoinColumn({name: 'registration_line_id'})
    line:lineEntity;

    @Column()
    users_id:number;

    @ManyToOne(() => UserEntity, (user) => user.no_schedule_stop)
    @JoinColumn({name: 'users_id'})
    user:UserEntity;

    @Column()
    no_scheduled_stop_code:string;

    @Column()
    device_id:number;

    @ManyToOne(() => DeviceEntity, (device) => device.no_schedule_stop)
    @JoinColumn({name:'device_id'})
        device:DeviceEntity;

    @Column()
    models_id:number;
    

    @ManyToOne(() => ModelsEntity, (models) => models.no_schedule_stop)
    @JoinColumn({name: 'models_id'})
    models:ModelsEntity;

    @Column()
    no_scheduled_stop_initial_time: Date;

    @Column()
    no_scheduled_stop_final_time:Date;

    @Column()
    no_scheduled_stop_total_time: number;

    @Column()
    no_scheduled_stop_reason:string;
    
    @Column()
    no_scheduled_stop_cause:string;

    @Column()
    no_scheduled_stop_create_date:Date;

    @Column()
    no_scheduled_stop_user:string;

}