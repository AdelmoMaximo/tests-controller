import { Module } from '@nestjs/common';
import { NotifyService } from './shared/notify.service';
import { NotifyController } from './controllers/notify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { a3_notifyEntity } from './entities/notify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([a3_notifyEntity])],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports:[NotifyService]
})
export class NotifyModule {}
