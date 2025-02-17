import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ModelsComponentEntity } from "../entities/models-component.entity";

export class UpdateModelsComponentDto extends OmitType(ModelsComponentEntity,[`models_component_id`,'models_id']){
    @ApiProperty()
    component_id: number;
}