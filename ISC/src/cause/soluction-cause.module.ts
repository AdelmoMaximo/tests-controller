import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DefectModule } from "src/defect/defect.module";
import { SoluctionModule } from "src/solution/soluction.module";
import { CauseController } from "./controllers/cause.controller";
import { SoluctionCauseController } from "./controllers/soluction-cause.controller";
import { CauseEntity } from "./entities/cause.entity";
import { SoluctionCauseEntity } from "./entities/soluction-cause.entity";
import { CauseService } from "./shared/cause.service";
import { SoluctionCauseService } from "./shared/soluction-cause.service";


@Module({
        imports:[
            TypeOrmModule.forFeature([SoluctionCauseEntity,CauseEntity]),
            DefectModule
        ],
        providers:[SoluctionCauseService,CauseService],
        controllers:[SoluctionCauseController,CauseController],
        exports:[SoluctionCauseService],
})
export class CauseModule{}