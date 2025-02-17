import { ApiProperty } from "@nestjs/swagger";

export class PatchStopDto {
    @ApiProperty({nullable:true, required:true})
    justify: string;
}