import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { LogActivityService } from './log-activity/log-activity.service';
import { LogActivityModule } from './log-activity/log-activity.module';
import { LogActivityController } from './log-activity/log-activity.controller'

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), LogActivityModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
