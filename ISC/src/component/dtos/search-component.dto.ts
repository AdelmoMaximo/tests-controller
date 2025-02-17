import { ApiProperty } from "@nestjs/swagger";

export class SearchComponentDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}