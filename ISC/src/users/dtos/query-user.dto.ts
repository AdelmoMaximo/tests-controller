import { ApiProperty } from "@nestjs/swagger";

export class QueryUserDto {
    @ApiProperty({nullable:true, required:false})
    search_type:number;
    @ApiProperty({nullable:false, required:true})
    order_type:number;
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}