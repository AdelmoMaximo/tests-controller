import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { ScheduleStopEntity } from "./entities/schedule-stop.entity";
import { ScheduledStopService } from "./shared/schedule-stop.service";
import { ScheduledStopController } from "./controllers/schedule-stop.controller";
import { ShiftModule } from "src/shifts/shifts.module";;
import { UsersModule } from "src/users/users.module";
import { LineModule } from "src/line/line.module";

@Module({
        imports:[
            ScheduleModule.forRoot(),
            TypeOrmModule.forFeature([ScheduleStopEntity]),
            ShiftModule,
            LineModule,
            UsersModule
        ],
        providers:[ScheduledStopService,],
        controllers:[ScheduledStopController],
        exports:[],
})
export class ScheduleStopModule{}