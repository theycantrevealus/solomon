import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory, JwtService } from '@nestjs/jwt';
import { ackErrorHandler, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { ITokenResponse } from './interfaces/auth.response.interface';
import env = require('dotenv');
env.config();
@Injectable()
export class AppService implements JwtOptionsFactory {
  constructor(private readonly jwtService: JwtService) {}
  createJwtOptions(): JwtModuleOptions {
    return { secret: 'taknakal' };
  }

  @RabbitRPC({
    exchange: `${process.env.AUTH_EXCHANGE_NAME}`,
    routingKey: `${process.env.AUTH_ROUTING_KEY_ADD}`,
    queue: 'auth_service_queue',
    errorHandler: ackErrorHandler,
  })
  async create_token(data: { uid: string }): Promise<ITokenResponse> {
    let result: ITokenResponse;
    if (data && data.uid) {
      try {
        const token = this.jwtService.sign(data, {
          expiresIn: 30 * 24 * 60 * 60,
        });

        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          token: token,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token_create_bad_request',
          token: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'token_create_bad_request',
        token: null,
      };
    }
    return result;
  }
}
