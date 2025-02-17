import { ShiftWeekController } from './controllers/shift_week.controller';
import { ShiftWeekEntity } from './entities/shift_week.entity';
import { ShiftsController } from './controllers/shift.controller';
import { ShiftEntity } from './entities/shift.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsService } from './shared/shifts.service';
import { ShiftWeekService } from './shared/shift_week.service';


@Module({
  imports:[
    TypeOrmModule.forFeature([ShiftEntity,ShiftWeekEntity]),

  ],
  providers: [ShiftsService, ShiftWeekService],
  controllers: [ShiftsController,ShiftWeekController],
  exports:[ShiftsService, ShiftModule]
})
export class ShiftModule {}