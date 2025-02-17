import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ShiftEntity } from "./shift.entity";

@Entity('SHIFTS_WEEK')
export class ShiftWeekEntity {
    @PrimaryGeneratedColumn()
    shifts_week_id: number;

    @Column()
    shifts_week_description: string;

    @Column()
    shifts_week_begin: Date

    @Column()
    shifts_week_end: Date

    @Column()
    shifts_id: number

    @ManyToOne(() => ShiftEntity, (shift) => shift.shiftweek)
    @JoinColumn({ name: 'shifts_id' })
    shift: ShiftEntity;

}
