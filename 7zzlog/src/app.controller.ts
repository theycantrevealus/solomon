import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return '';
  }

  @Get('search')
  async searchPokemonAbilities(@Query('q') q: string) {
    const results = await this.appService.searchIndex(q);
    return results;
  }
}