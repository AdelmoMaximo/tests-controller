import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserEntity } from "../entities/user.entity";

export class UpdateUserDto extends OmitType(UserEntity, ['users_id','users_token','users_create']){
    @ApiProperty()
    users_login: string;

    @ApiProperty()
    users_email: string;

    @ApiProperty()
    users_name: string;

    @ApiProperty()
    @Exclude({toPlainOnly: true})
    users_password: string;

    @ApiProperty()
    profile_id: number;

    @ApiProperty()
    users_update_data: Date;

    @ApiProperty()
    user_update_user: string;

    @ApiProperty()
    users_status: boolean;

    @ApiProperty()
    count_tries: number;
    
    @ApiProperty()
    users_justify: number;

}