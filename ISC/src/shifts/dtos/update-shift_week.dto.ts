import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ShiftWeekEntity } from "../entities/shift_week.entity";

export class UpdateShiftWeekDto extends OmitType(ShiftWeekEntity,['shift','shifts_week_id','shifts_id']){
    @ApiProperty()
    shifts_week_description: string;

    @ApiProperty()
    shifts_week_begin: Date

    @ApiProperty()
    shifts_week_end: Date
}