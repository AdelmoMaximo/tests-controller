import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PdcaEntity } from "./entities/pdca.entity";
import { UserEntity } from "./entities/user.entity";
import { PdcaService } from "./shared/pdca.service";
import { PdcaController } from "./controllers/pdca.controller";
import { PdcaA3Entity } from "./entities/pdcaa3.entity";
import { PdcaA3Service } from "./shared/pdcaA3.service";
import { PdcaA3Controller } from "./controllers/pdcaA3.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { UserService } from "./shared/user.service";
import { NotifyModule } from "src/notify/notify.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([PdcaA3Entity,PdcaEntity,UserEntity]),
        ScheduleModule.forRoot(),
        NotifyModule
    ],
    providers:[PdcaService,PdcaA3Service,UserService],
    controllers:[PdcaController,PdcaA3Controller],
    exports:[PdcaA3Service,UserService],
})
export class PdcaModule{}