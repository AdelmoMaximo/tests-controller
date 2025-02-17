import { ApiProperty } from "@nestjs/swagger";

export class SearchDeviceDto {

    @ApiProperty({nullable:true, required:false})
    order_type:number;
    
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}