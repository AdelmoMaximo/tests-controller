import { ApiProperty } from "@nestjs/swagger";

export class validadePass {
    @ApiProperty({nullable:false, required:true})
    id:number;
    @ApiProperty({nullable:false, required:true})
    password: string;
}