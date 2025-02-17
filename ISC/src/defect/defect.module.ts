import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DefectController } from "./controllers/defect.controller";
import { DefectEntity } from "./entities/defect.entity";
import { DefectService } from "./shared/defect.service";
import { DefectCauseEntity } from "./entities/defect-cause.entity";
import { DefectCauseService } from "./shared/defect-cause.service";
import { DefectCauseController } from "./controllers/defect-cause.controller";


@Module({
        imports:[
            TypeOrmModule.forFeature([DefectEntity,DefectCauseEntity]),
        ],
        providers:[DefectService,DefectCauseService],
        controllers:[DefectController,DefectCauseController],
        exports:[DefectCauseService],
})
export class DefectModule{}