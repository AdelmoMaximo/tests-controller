import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ScheduleStopEntity } from "../entities/schedule-stop.entity";

export class CreateScheduledStopDto extends OmitType(ScheduleStopEntity,['scheduled_stop_id','scheduled_stop_date_created','scheduled_stop_code']){
    @ApiProperty()
    scheduled_stop_date: Date;

    @ApiProperty()
    scheduled_stop_description: string;
    
    @ApiProperty()
    scheduled_stop_estimated_time: Date;

    @ApiProperty()
    scheduled_stop_is_actvie: boolean;

    @ApiProperty()
    scheduled_stop_registration_line_id: number;

    @ApiProperty()
    scheduled_stop_shifts_id: number;

    @ApiProperty()
    scheduled_stop_type: string;

    @ApiProperty()
    scheduled_stop_users_created: string;

    @ApiProperty()
    scheduled_stop_users_id: number;
}