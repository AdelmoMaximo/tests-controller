import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ProfileEntity } from "../entities/profile.entity";

export class CreateProfileDto extends OmitType(ProfileEntity,['profile_id','profile_create_date','transactions']){
    @ApiProperty()
    profile_name: string;

    @ApiProperty()
    profile_status: boolean;
}