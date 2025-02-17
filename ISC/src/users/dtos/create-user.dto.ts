import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserEntity } from "../entities/user.entity";

export class CreateUserDto extends OmitType(UserEntity, ['users_id','users_token','users_update_data','user_update_user']){
    @ApiProperty()
    users_login: string;

    @ApiProperty()
    users_email: string;

    @ApiProperty()
    users_name: string;

    @ApiProperty()
    user_status: boolean;

    @ApiProperty()
    count_tries: number;

    @ApiProperty()
    @Exclude({toPlainOnly: true})
    users_password: string;

    @ApiProperty()
    profile_id: number;
    
    @ApiProperty()
    users_create: string;

}