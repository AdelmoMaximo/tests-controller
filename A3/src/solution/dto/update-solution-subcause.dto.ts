import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SolutionSubcauseEntity } from '../entities/solution-subcause.entity';

export class UpdateSolutionSubcauseDto extends OmitType(SolutionSubcauseEntity,['soluction_subcase_id', 'soluction_subcause_created','a3_cause_id', 'a3_registry_id', 'a3_subcause_id']) {

  @ApiProperty()
  soluction_subcause_description: string;

  @ApiProperty()
  a3_user: string;


}
