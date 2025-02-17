import { ApiProperty, OmitType } from "@nestjs/swagger";
import { a3_notifyEntity } from "../entities/notify.entity";


export class CreateNotifyDto extends OmitType(a3_notifyEntity,['a3_notify_created_at', 'pdcaa3_id']) {

    @ApiProperty()
    a3_notify_message: string;
  
    @ApiProperty()
    pdcaa3_id: number;    

}