import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ComponentEntity } from "../entities/component.entity";

export class CreateComponentDto extends OmitType(ComponentEntity,['component_id']){
    @ApiProperty()
    component_descrition: string;
}