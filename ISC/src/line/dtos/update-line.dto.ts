import { ApiProperty, OmitType } from "@nestjs/swagger";

import { lineEntity } from "../entities/line.entity";


export class UpdateLineDto extends OmitType(lineEntity,['registration_line_id','line_create_date','line_create_user','line_update_date']) {
  @ApiProperty()
  line_name: string;

  @ApiProperty()
  phase_name: string;

  @ApiProperty()
  status_line: boolean;

  @ApiProperty()
  line_update_user: string;
  
}
