import { ApiProperty } from "@nestjs/swagger";

export class SearchShiftDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}