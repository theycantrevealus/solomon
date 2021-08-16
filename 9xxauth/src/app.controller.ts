import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';

// import { SolomonAuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(SolomonAuthGuard)
  @Post('auth/login')
  login(@Body() req) {
    return this.appService.login(req);
  }
}
