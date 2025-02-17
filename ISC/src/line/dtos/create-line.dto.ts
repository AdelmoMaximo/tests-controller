import { ApiProperty, OmitType } from "@nestjs/swagger";
import { lineEntity } from "../entities/line.entity";


export class CreateLineDto extends OmitType(lineEntity,['line_update_user','line_create_date','line_update_date','status_line']){
  @ApiProperty()
  line_name: string;

  @ApiProperty()
  phase_name: string;

  @ApiProperty()
  line_create_user: string;

}