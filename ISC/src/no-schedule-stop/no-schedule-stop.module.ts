import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoScheduleStopEntity } from './entities/no-schedule-stop.entity';
import { NoScheduledStopService } from './shared/no-scheduled-stop.service';
import { NoScheduledStopController } from './controllers/no-scheduled-stop.controller';
import { ShiftModule } from "src/shifts/shifts.module";;
import { UsersModule } from "src/users/users.module";
import { LineModule } from "src/line/line.module";
import { DeviceModule } from 'src/device/device.module';
import { ModelModule } from "src/models/models.module";
import { ShiftsService } from 'src/shifts/shared/shifts.service';
import { LineService } from 'src/line/shared/line.service';
import { UsersService } from 'src/users/shared/users.service';
import { ModelService } from 'src/models/shared/models.service';
import { DeviceService } from'src/device/shared/device.service';
import { lineEntity } from 'src/line/entities/line.entity';
import { ShiftEntity } from 'src/shifts/entities/shift.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ModelsEntity } from 'src/models/entities/models.entity';


@Module({
  imports: [TypeOrmModule.forFeature([NoScheduleStopEntity,ShiftEntity,UserEntity, lineEntity, ModelsEntity, DeviceModule]),
  ShiftModule,
  UsersModule,
  DeviceModule,
  LineModule,
  ModelModule],
  providers: [NoScheduledStopService],
  controllers: [NoScheduledStopController],
  
})
export class NoScheduleStopModule { }