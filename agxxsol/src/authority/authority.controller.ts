import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoginUserResponseDTO } from '../interfaces/user/dto/user.response.dto';
import { LoginUserDto } from '../interfaces/user/dto/user.dto';

@Controller('authority')
@ApiTags('authority')
export class AuthorityController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @Post('add')
  @ApiCreatedResponse({
    type: LoginUserResponseDTO,
  })
  async login(@Body() data: LoginUserDto) {
    return await this.amqpConnection.request({
      exchange: `${process.env.USER_EXCHANGE_NAME}`,
      routingKey: 'authority_add',
      payload: data,
    });
  }
}
