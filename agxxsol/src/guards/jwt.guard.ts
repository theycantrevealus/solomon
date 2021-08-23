import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IServiveTokenDecodeResponse } from '../interfaces/token/token.decode.interface';
import { IServiceUserDetailResponse } from '../interfaces/user/user.detail.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super();
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      new UnauthorizedException();
      return false;
    }

    const decodeTokenResponse: IServiveTokenDecodeResponse =
      await this.amqpConnection.request<IServiveTokenDecodeResponse>({
        exchange: `${process.env.AUTH_EXCHANGE_NAME}`,
        routingKey: `${process.env.AUTH_ROUTING_KEY_DECODE}`,
        payload: {
          token: request.headers.authorization,
        },
      });

    if (!decodeTokenResponse.user) {
      throw new HttpException(
        {
          message: decodeTokenResponse.message,
          data: null,
          errors: null,
        },
        decodeTokenResponse.status,
      );
    }
    const detailUserResponse: IServiceUserDetailResponse =
      await this.amqpConnection.request<IServiceUserDetailResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: `${process.env.USER_ROUTING_KEY_DETAIL}`,
        payload: { uid: decodeTokenResponse.user },
      });

    console.log(decodeTokenResponse.user);

    if (
      !decodeTokenResponse ||
      !decodeTokenResponse.token ||
      !decodeTokenResponse.user ||
      !detailUserResponse.user
    ) {
      throw new HttpException(
        {
          message: decodeTokenResponse.message,
          data: null,
          errors: null,
        },
        decodeTokenResponse.status,
      );
    }

    request.user = detailUserResponse.user;
    return true;
  }
}
