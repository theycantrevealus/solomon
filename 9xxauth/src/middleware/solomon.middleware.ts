import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
export class SolomonStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AppService) {
    super();
  }
}
