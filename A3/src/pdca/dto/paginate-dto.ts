import { ApiProperty } from "@nestjs/swagger";

export class pdcaA3ElementDto{
    @ApiProperty()
    id:number;

    @ApiProperty()
    registry_name:string

    @ApiProperty()
    action_number:number;

    @ApiProperty()
    in_charge: string;

    @ApiProperty()
    status:number;

    @ApiProperty()
    is_closed:boolean;
}