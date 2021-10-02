import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory, JwtService } from '@nestjs/jwt';
import {
  ackErrorHandler,
  AmqpConnection,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { ITokenResponse } from './interfaces/auth.response.interface';
import env = require('dotenv');
import { ITokenDecodeResponse } from './interfaces/auth.decode.interface';
env.config();
@Injectable()
export class AppService implements JwtOptionsFactory {
  constructor(
    private readonly jwtService: JwtService,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  createJwtOptions(): JwtModuleOptions {
    return { secret: 'taknakal' };
  }

  @RabbitRPC({
    exchange: `${process.env.AUTH_EXCHANGE_NAME}`,
    routingKey: `${process.env.AUTH_ROUTING_KEY_AUTH}`,
    queue: 'auth_service_create',
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

  @RabbitRPC({
    exchange: `${process.env.AUTH_EXCHANGE_NAME}`,
    routingKey: `${process.env.AUTH_ROUTING_KEY_DECODE}`,
    queue: 'auth_service_decode',
    errorHandler: ackErrorHandler,
  })
  async validate_token(data: { token: string }): Promise<ITokenResponse> {
    let result: ITokenDecodeResponse;
    if (data && data.token) {
      try {
        const cleanToken = data.token.split('Bearer')[1].trim();
        const decoded = await this.jwtService.decode(cleanToken, {
          complete: true,
        });
        const decodedData = (decoded as any).payload;
        if (decoded) {
          result = {
            status: HttpStatus.OK,
            message: 'token_decoded_success',
            user: decodedData.uid,
            token: data.token,
          };
        } else {
          //USER_ROUTING_KEY_DETAIL
          result = {
            status: HttpStatus.FORBIDDEN,
            message: 'token_unauthorized',
            user: '',
            token: data.token,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token malformed',
          user: '',
          token: data.token,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'undefined token',
        user: '',
        token: data.token,
      };
    }
    return result;
  }
}
