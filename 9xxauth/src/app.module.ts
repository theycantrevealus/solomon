import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { SolomonStrategy } from './middleware/solomon.middleware';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constant';
import { JwtStrategy } from './middleware/auth.middleware';
import { AppController } from './app.controller';

@Module({
  providers: [AppService, SolomonStrategy, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  exports: [AppService],
})
export class AppModule {}
