import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './entities/device.entity';
import { DeviceService } from './shared/device.service';
import { DeviceController } from './controllers/device.controller';
import { LineModule } from 'src/line/line.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]),
    LineModule
  ],

  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService, DeviceModule]
})
export class DeviceModule { }
