import { ApiProperty } from "@nestjs/swagger";

export class PatchUserDto {
    @ApiProperty({nullable:true, required:false})
    justify:number;
}