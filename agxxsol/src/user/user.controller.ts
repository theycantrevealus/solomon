import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { v4 as uuid } from 'uuid';

//DTO
import { CreateUserDto } from '../interfaces/user/dto/user.create.dto';
import { CreateUserResponseDto } from '../interfaces/user/dto/user.create.response.dto';
import { IServiceUserCreateResponse } from '../interfaces/user/user.create.interface';
import { UserService } from './user.service';
import { IServiveTokenCreateResponse } from '../interfaces/token/token.create.interface';
import { EditUserDto } from '../interfaces/user/dto/user.edit.dto';
import { IServiceUserEditResponse } from '../interfaces/user/user.edit.interface';
import { EditUserResponseDto } from '../interfaces/user/dto/user.edit.response.dto';
import { LoginUserResponseDto } from '../interfaces/user/dto/user.login.response.dto';
import { IServiceUserLoginResponse } from '../interfaces/user/user.login.interface';
import { LoginUserDto } from '../interfaces/user/dto/user.login.dto';
import { DetailUserResponseDto } from '../interfaces/user/dto/user.detail.response.dto';
import { IServiceUserDetailResponse } from '../interfaces/user/user.detail.interface';
import { DetailUserDto } from '../interfaces/user/dto/user.detail.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly userService: UserService,
  ) {}

  @Get()
  public async getAll() {
    //return await this.service.getAll();
  }

  @Get(':uid')
  @ApiCreatedResponse({
    type: DetailUserResponseDto,
  })
  public async getByUID(@Param('uid') uid: DetailUserDto) {
    const detailUserResponse: IServiceUserDetailResponse =
      await this.amqpConnection.request<IServiceUserDetailResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: `${process.env.USER_ROUTING_KEY_DETAIL}`,
        payload: uid,
      });
    return {
      message: detailUserResponse.message,
      data: {
        user: detailUserResponse.user,
      },
      errors: null,
    };
  }

  @Post('paging')
  async getPaging(@Body() data) {
    //return this.service.getPaging(data);
  }

  @Post('login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  async login(@Body() data: LoginUserDto) {
    const loginUserResponse: IServiceUserLoginResponse =
      await this.amqpConnection.request<IServiceUserLoginResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: 'user_login',
        payload: data,
      });
    if (loginUserResponse.status !== HttpStatus.ACCEPTED) {
      throw new HttpException(
        {
          message: loginUserResponse.message,
          errors: loginUserResponse.errors,
        },
        loginUserResponse.status,
      );
    }

    const loginTokenResponse: IServiveTokenCreateResponse =
      await this.amqpConnection.request<IServiveTokenCreateResponse>({
        exchange: `${process.env.AUTH_EXCHANGE_NAME}`,
        routingKey: `${process.env.AUTH_ROUTING_AUTH}`,
        payload: {
          uid: loginUserResponse.user.uid,
        },
      });

    return {
      message: loginTokenResponse.message,
      data: {
        user: loginUserResponse.user,
        token: loginTokenResponse.token || 'no-token',
      },
      errors: null,
    };
  }

  @Put('edit')
  @ApiCreatedResponse({
    type: EditUserResponseDto,
  })
  async editUser(@Body() data: EditUserDto) {
    const editUserResponse: IServiceUserEditResponse =
      await this.amqpConnection.request<IServiceUserEditResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: `${process.env.USER_ROUTING_KEY_EDIT}`,
        payload: data,
      });
    if (editUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: editUserResponse.message,
          errors: editUserResponse.errors,
        },
        editUserResponse.status,
      );
    }

    return {
      message: editUserResponse.message,
      data: {
        user: editUserResponse.user,
      },
      errors: null,
    };
  }

  @Post('add')
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  async addUser(@Body() data: CreateUserDto) {
    const createUserResponse: IServiceUserCreateResponse =
      await this.amqpConnection.request<IServiceUserCreateResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: `${process.env.USER_ROUTING_KEY_ADD}`,
        payload: data,
      });
    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          errors: createUserResponse.errors,
        },
        createUserResponse.status,
      );
    }

    return {
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
      },
      errors: null,
    };
  }

  @Delete(':uid')
  async delete(@Param('uid') uid: string) {
    /*const data = await this.service.getDetail(uid);
    data.deleted_at = new Date().toISOString();
    return this.service.update(UserDTO.from(data)).then(() => {
      this.amqpConnection.publish('pdc_user', 'user_delete', uid);
    });*/
  }
}
