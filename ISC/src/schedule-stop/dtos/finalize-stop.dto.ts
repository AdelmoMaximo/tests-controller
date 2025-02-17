import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ScheduleStopEntity } from "../entities/schedule-stop.entity";

export class FinalizeScheduledStopDto extends OmitType(ScheduleStopEntity,['scheduled_stop_id','scheduled_stop_date_created','scheduled_stop_code','scheduled_stop_is_actvie','scheduled_stop_users_created','scheduled_stop_type']){

    @ApiProperty()
    scheduled_stop_tempo_real: Date;

    @ApiProperty()
    scheduled_stop_causa_identificada: string;

    @ApiProperty()
    scheduled_stop_acao_executada: string;

    @ApiProperty()
    scheduled_stop_users_id: number;
}