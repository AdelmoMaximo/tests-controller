import { DeviceEntity } from 'src/device/entities/device.entity';
import { ScheduleStopEntity } from 'src/schedule-stop/entities/schedule-stop.entity';
import { NoScheduleStopEntity } from 'src/no-schedule-stop/entities/no-schedule-stop.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('REGISTRATION_LINE')
export class lineEntity {
  @PrimaryGeneratedColumn()
  registration_line_id: number;

  @Column()
  line_name: string;

  @Column()
  phase_name: string;

  @Column()
  phase_line: string;

  @Column()
  status_line: boolean;

  @Column()
  line_create_date: Date;

  @Column()
  line_update_date: Date;

  @Column()
  line_update_user: String;

  @Column()
  line_create_user: String;

  @OneToMany(() => DeviceEntity, (device) => device.phase_line)
  Device!: DeviceEntity[];

  @OneToMany(() => ScheduleStopEntity, (models) => models.line)
  schedule_stop!: ScheduleStopEntity[];

  @OneToMany(() => NoScheduleStopEntity, (models) => models.line)
  no_schedule_stop!: NoScheduleStopEntity[];
}

