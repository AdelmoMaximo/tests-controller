import { lineEntity } from 'src/line/entities/line.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NoScheduleStopEntity } from 'src/no-schedule-stop/entities/no-schedule-stop.entity';


@Entity('DEVICE')
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  device_id: number;

  @Column()
  device_name: string;

  @Column()
  device_status: boolean;

  @Column()
  device_create_date: Date;

  @Column()
  device_create_user: String;

  @Column()
  device_update_date: Date;

  @Column()
  device_update_user: String;

  @Column()
  registration_line_id: number;

  @ManyToOne(() => lineEntity, (line) => line.Device)
  @JoinColumn({ name: 'registration_line_id' })
  phase_line: lineEntity;

  @OneToMany(() => NoScheduleStopEntity, (models) => models.device)
  no_schedule_stop!: NoScheduleStopEntity[];
}
