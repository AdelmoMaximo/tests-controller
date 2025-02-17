import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @ApiProperty({nullable:false, required:true})
    id:number;
    @ApiProperty({nullable:false, required:true})
    new_password: string;
    @ApiProperty({nullable:false, required:true})
    confirm_new_password: string;
}