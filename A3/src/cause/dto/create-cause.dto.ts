import { ApiProperty, OmitType } from '@nestjs/swagger';
import { a3_causeEntity } from '../entities/a3_cause.entity';

export class CreateA3_CauseDto extends OmitType(a3_causeEntity,['a3_cause_id']){

    @ApiProperty()
    a3_cause_category: string;

    @ApiProperty()
    a3_cause_description: string;

    @ApiProperty()
    a3_registry_id: number;

}