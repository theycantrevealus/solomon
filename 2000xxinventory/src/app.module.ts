import { Module } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterItemModule } from './master.item/master.item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    MasterItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
