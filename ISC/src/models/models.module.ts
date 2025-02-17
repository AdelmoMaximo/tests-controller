import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModelsComponentEntity } from "./entities/models-component.entity";
import { ModelsEntity } from "./entities/models.entity";
import { ModelService } from "./shared/models.service";
import { ModelController } from "./controllers/models.controller";
import { ModelsComponentService } from "./shared/models-component.service";
import { ModelComponentController } from "./controllers/models-component.controller";
import { ComponentModule } from "src/component/component.module";
import { SupplierModule } from "src/supplier/supplier.module";


@Module({
        imports:[
            TypeOrmModule.forFeature([ModelsComponentEntity,ModelsEntity]),forwardRef( () =>SupplierModule)],
        providers:[ModelService,ModelsComponentService],
        controllers:[ModelController,ModelComponentController],
        exports:[ModelsComponentService, ModelService],
})
export class ModelModule{}