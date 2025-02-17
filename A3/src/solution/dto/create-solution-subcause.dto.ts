import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SolutionSubcauseEntity } from '../entities/solution-subcause.entity';

export class CreateSolutionSubcauseDto extends OmitType(SolutionSubcauseEntity,['soluction_subcase_id', 'soluction_subcause_created']) {

  @ApiProperty()
  soluction_subcause_description: string;

  @ApiProperty()
  a3_registry_id: number;

  @ApiProperty()
  a3_cause_id: number;

  @ApiProperty()
  a3_user: string;

  @ApiProperty()
  a3_subcause_id: number;

}
