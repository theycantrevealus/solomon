import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('pokemon')
export class AppController {
  constructor(
      private readonly appService: AppService,
  ) {}

  @Post('create')
  async createIndexAndInsert(@Body() documents: any[]) {
    // return await this.appService.bulkInsert(documents, 'log_activity');
  }

  @Get('search')
  async searchPokemonAbilities(@Query('q') q: string) {
    const results = await this.appService.searchIndex(q);
    return results;
  }

  @EventPattern('user_login')
  async syncActivityLog(data: Record<string, unknown>) {
    return await this.appService.bulkInsert([data], 'log_activity').then(() => {
      console.log(`[LOG] - ${data.user_uid}`);
    });
  }
}