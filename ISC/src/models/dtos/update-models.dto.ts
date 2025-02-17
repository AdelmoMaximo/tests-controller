import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ModelsEntity } from "../entities/models.entity";

export class UpdateModelsDto extends OmitType(ModelsEntity,['models_id','models_create_date','models_update_date','models_create_user']){
    @ApiProperty()
    models_identity: string;

    @ApiProperty()
    models_name: string;

    @ApiProperty()
    supplier_id: number;

    @ApiProperty()
    models_update_user: string;
}