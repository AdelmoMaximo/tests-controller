import { ApiProperty } from "@nestjs/swagger";

export class SearchDefectDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}