import { ApiProperty } from "@nestjs/swagger";

export class SearchNoScheduledDto {
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}