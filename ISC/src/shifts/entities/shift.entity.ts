import { Column, Entity , PrimaryGeneratedColumn, PrimaryColumn,OneToMany } from "typeorm";
import { ShiftWeekEntity } from "./shift_week.entity";
import { NoScheduleStopEntity } from "src/no-schedule-stop/entities/no-schedule-stop.entity";
import { ScheduleStopEntity } from "src/schedule-stop/entities/schedule-stop.entity";

@Entity('SHIFTS')

export class ShiftEntity{
    
    @PrimaryGeneratedColumn()
    shifts_id: number;

    @Column()
    shifts_name:string;

    @Column()
    shifts_acronym:string;

    @Column()
    shifts_create_date:Date;

    @Column()
    shifts_status:boolean;

    @OneToMany(() => ShiftWeekEntity, (shiftweek) => shiftweek.shift)
    shiftweek!: ShiftWeekEntity[];

    @Column()
    shifts_delete:boolean;

    @Column()
    shifts_creator:string;

    @Column()
    shifts_update_user: string;

    @Column()
    shifts_update_data: Date;

    @OneToMany(() => ScheduleStopEntity, (models) => models.shift)
    schedule_stop!: ScheduleStopEntity[];

    @OneToMany(() => NoScheduleStopEntity, (models) => models.shift)
    no_schedule_stop!: NoScheduleStopEntity[];
  }

