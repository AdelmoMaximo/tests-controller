import { ShiftModule } from './shifts/shifts.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from './config/environments/config.module';
import { SwaggerModule } from './config/swagger/swagger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { SoluctionModule } from './solution/soluction.module';
import { CauseModule } from './cause/soluction-cause.module';
import { SupplierModule } from './supplier/supplier.module';
import { DefectModule } from './defect/defect.module';
import { ComponentModule } from './component/component.module';
import { ModelModule } from './models/models.module';
import { DeviceModule } from './device/device.module';
import { LineModule } from './line/line.module';
import { ScheduleStopModule } from './schedule-stop/schedule-stop.module';
import { NoScheduleStopModule } from './no-schedule-stop/no-schedule-stop.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SwaggerModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    ShiftModule,
    SoluctionModule,
    CauseModule,
    SupplierModule,
    DefectModule,
    ComponentModule,
    ModelModule,
    DeviceModule,
    LineModule,
    ScheduleStopModule,
    NoScheduleStopModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
