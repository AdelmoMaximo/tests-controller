import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SoluctionCauseEntity } from "src/cause/entities/soluction-cause.entity";
import { CauseModule } from "src/cause/soluction-cause.module";
import { SoluctionController } from "./controllers/soluction.controller";
import { SoluctionEntity } from "./entities/soluction.entity";
import { SoluctionService } from "./shared/soluction.service";

@Module({
        imports:[
            TypeOrmModule.forFeature([SoluctionEntity]),
            CauseModule
        ],
        providers:[SoluctionService],
        controllers:[SoluctionController],
        exports:[],
})
export class SoluctionModule{}