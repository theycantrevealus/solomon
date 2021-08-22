import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogActivity } from '../model/log.activity';
import { LogActivityService } from './log-activity.service';
import { LogActivityController } from './log-activity.controller';
import { configService } from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([LogActivity], 'default'),
  ],
  providers: [LogActivityService],
  controllers: [LogActivityController],
  exports: [LogActivityService],
})
export class LogActivityModule {}
