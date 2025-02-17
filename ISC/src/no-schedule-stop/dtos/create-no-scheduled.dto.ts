import { ApiProperty, OmitType } from "@nestjs/swagger";
import { NoScheduleStopEntity } from "../entities/no-schedule-stop.entity";


export class CreateNoScheduledStopDto extends OmitType(NoScheduleStopEntity, ['no_scheduled_stop_id', 'no_scheduled_stop_total_time', 'no_scheduled_stop_code', 'no_scheduled_stop_create_date',]) {
    
    @ApiProperty()
    no_scheduled_stop_type: string;

    @ApiProperty()
    no_scheduled_stop_reason: string;

    @ApiProperty()
    no_scheduled_stop_cause: string;

    @ApiProperty()
    device_id: number;

    @ApiProperty()
    registration_line_id: number;

    @ApiProperty()
    users_id: number;

    @ApiProperty()
    models_id: number;

    @ApiProperty()
    shifts_id: number;

    @ApiProperty()
    no_scheduled_stop_date: Date;

    @ApiProperty()
    no_scheduled_stop_initial_time: Date;

    @ApiProperty()
    no_scheduled_stop_final_time: Date;

    @ApiProperty()
    no_scheduled_stop_user:string;

}