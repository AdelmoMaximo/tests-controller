import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComponentEntity } from "./entities/component.entity";
import { ComponentService } from "./shared/component.service";
import { ComponentController } from "./controllers/component.controller";
import { ModelModule } from "src/models/models.module";

@Module({
        imports:[
            TypeOrmModule.forFeature([ComponentEntity]),
            ModelModule
        ],
        providers:[ComponentService,],
        controllers:[ComponentController],
        exports:[ComponentService],
})
export class ComponentModule{}