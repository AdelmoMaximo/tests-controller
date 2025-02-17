import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ModelsEntity } from "../entities/models.entity";
import { ModelsComponentEntity } from "../entities/models-component.entity";

export class CreateModelsComponentDto extends OmitType(ModelsComponentEntity,[`models_component_id`]){
    @ApiProperty()
    models_id: number;

    @ApiProperty()
    component_id: number;
}