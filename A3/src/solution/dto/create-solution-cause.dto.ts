import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SolutionCauseEntity } from '../entities/solution-cause.entity';

export class CreateSolutionCauseDto extends OmitType(SolutionCauseEntity,['soluction_case_id', 'soluction_cause_created']) {

  @ApiProperty()
  soluction_cause_description: string;

  @ApiProperty()
  a3_registry_id: number;

  @ApiProperty()
  a3_cause_id: number;

  @ApiProperty()
  a3_user: string;
}
