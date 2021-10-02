import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/orm.config';
import { UserModule } from './user/user.module';
import { AuthorityController } from './authority/authority.controller';
import { AuthorityService } from './authority/authority.service';
import { AuthorityModule } from './authority/authority.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthorityModule,
  ],
  controllers: [AppController, AuthorityController],
  providers: [AppService, AuthorityService],
})
export class AppModule {}
