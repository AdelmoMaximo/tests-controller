import { ApiProperty, OmitType } from '@nestjs/swagger';
import { a3_subcauseEntity } from '../entities/a3_subcause.entity';

export class UpdateA3_SubcauseDto extends OmitType(a3_subcauseEntity,['a3_subcause_id','a3_cause_id','a3_registry_id']){

    @ApiProperty()
    a3_subcause_description: string;

}