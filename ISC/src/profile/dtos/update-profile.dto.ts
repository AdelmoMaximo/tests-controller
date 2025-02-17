import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ProfileEntity } from "../entities/profile.entity";

export class UpdateProfileDto extends OmitType(ProfileEntity,['profile_id','profile_create_date','transactions','profile_status']){
    @ApiProperty()
    profile_name: string;
    
}