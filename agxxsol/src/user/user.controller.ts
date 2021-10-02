import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

//DTO
import { LoginUserDto } from '../interfaces/user/dto/user.dto';
import { LoginUserResponseDTO } from '../interfaces/user/dto/user.response.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  //===================================================================================================================
  @Get()
  public async getAll() {
    //return await this.service.getAll();
  }
  //===================================================================================================================
  /*@Get(':uid')
  @ApiCreatedResponse({
    type: DetailUserResponseDto,
  })
  @ApiOperation({ summary: 'Get user identified by uid' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  public async getByUID(@Param('uid') uid) {
    const detailUserResponse: IServiceUserDetailResponse =
      await this.amqpConnection.request<IServiceUserDetailResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: `${process.env.USER_ROUTING_KEY_DETAIL}`,
        payload: { uid: uid },
      });
    if (detailUserResponse.status === HttpStatus.OK) {
      return {
        message: detailUserResponse.message,
        data: {
          user: detailUserResponse.user,
        },
        errors: null,
      };
    } else {
      throw new HttpException(
        {
          message: detailUserResponse.message,
          errors: detailUserResponse.error,
        },
        detailUserResponse.status,
      );
    }
  }*/
  //===================================================================================================================
  @Post('paging')
  async getPaging(@Body() data) {
    //return this.service.getPaging(data);
  }
  //===================================================================================================================
  @Post('login')
  @ApiCreatedResponse({
    type: LoginUserResponseDTO,
  })
  async login(@Body() data: LoginUserDto) {
    return await this.amqpConnection.request({
      exchange: `${process.env.USER_EXCHANGE_NAME}`,
      routingKey: 'user_login',
      payload: data,
    });
  }
  //===================================================================================================================
  /*@Put('edit')
  @ApiCreatedResponse({
    type: EditUserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  async editUser(@Body() data: EditUserDto) {
    const editUserResponse: IServiceUserEditResponse =
      await this.amqpConnection.request<IServiceUserEditResponse>({
        exchange: `${process.env.USER_EXCHANGE_NAME}`,
        routingKey: `${process.env.USER_ROUTING_KEY_EDIT}`,
        payload: data,
      });
    if (editUserResponse.status !== HttpStatus.OK) {
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
  }*/
  //===================================================================================================================
  /*@Post('add')
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
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
  }*/
  //===================================================================================================================
  @Delete(':uid')
  async delete(@Param('uid') uid: string) {
    /*const data = await this.service.getDetail(uid);
    data.deleted_at = new Date().toISOString();
    return this.service.update(UserDTO.from(data)).then(() => {
      this.amqpConnection.publish('pdc_user', 'user_delete', uid);
    });*/
  }
}
