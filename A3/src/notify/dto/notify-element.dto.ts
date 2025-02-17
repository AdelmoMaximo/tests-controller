import { ApiProperty } from "@nestjs/swagger";

export class NotifyElementDto{
    @ApiProperty()
    id:number;

    @ApiProperty()
    notify_message:string

    @ApiProperty()
    notify_is_seen:boolean;

    @ApiProperty()
    notify_created_at: Date;

    @ApiProperty()
    no_seen_number:number;
}