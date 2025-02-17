import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SolutionCauseEntity } from '../entities/solution-cause.entity';


export class UpdateSolutionCauseDto extends OmitType(SolutionCauseEntity,['soluction_case_id', 'soluction_cause_created','a3_cause_id', 'a3_registry_id']) {

  @ApiProperty()
  soluction_cause_description: string;

  @ApiProperty()
  a3_user: string;
}
