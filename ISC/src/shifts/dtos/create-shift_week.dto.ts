import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ShiftWeekEntity } from "../entities/shift_week.entity";

export class CreateShiftWeekDto extends OmitType(ShiftWeekEntity,['shift','shifts_week_id']){
    @ApiProperty()
    shifts_week_description: string;

    @ApiProperty()
    shifts_week_begin: Date

    @ApiProperty()
    shifts_week_end: Date

    @ApiProperty()
    shifts_id: number
}