import { Injectable } from '@nestjs/common';
import {
  ackErrorHandler,
  AmqpConnection,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import * as bcrypt from 'bcrypt';
import env = require('dotenv');
import { UserDTO, UserLoginDTO } from '../interfaces/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../model/user.model';
import { getConnection, IsNull, Not, Repository } from 'typeorm';
import {
  userCreateRequestDup,
  userCreateRequestFailed,
  userCreateRequestSuccess,
  userDeleteRequestFailed,
  userDeleteRequestSuccess,
  userLoginRequestFailed,
  userLoginRequestSuccess,
  userNotFound,
  userUpdateRequestFailed,
  userUpdateRequestSuccess,
} from '../interfaces/dto/user.response.dto';
import { tokenRMQResponse } from '../interfaces/token.response.interface';
env.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  //======================================================================SELECT SECTION

  async check_dup(email: string) {
    return await getConnection()
      .getRepository(UserModel)
      .createQueryBuilder('user')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere('email = :email')
      .setParameters({ email: email })
      .getOne();
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_DETAIL}`,
    queue: 'user_service_get_detail',
    errorHandler: ackErrorHandler,
  })
  async detail(uid: string) {
    return await this.userRepo.findOne({
      where: { uid: uid, deleted_at: null },
    });
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_GET_ACTIVE}`,
    queue: 'user_service_get_active',
    errorHandler: ackErrorHandler,
  })
  async get_active(): Promise<UserDTO[]> {
    return await this.userRepo.find({ deleted_at: null });
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_GET_DELETED}`,
    queue: 'user_service_get_deleted',
    errorHandler: ackErrorHandler,
  })
  async get_deleted(): Promise<UserDTO[]> {
    return await this.userRepo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
    });
  }
  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_GET_ALL}`,
    queue: 'user_service_get_all',
    errorHandler: ackErrorHandler,
  })
  async get_all(): Promise<UserDTO[]> {
    return await this.userRepo.find({
      withDeleted: true,
    });
  }

  async get_paging(data: any): Promise<UserDTO[]> {
    return getConnection()
      .getRepository(UserModel)
      .createQueryBuilder('user')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere(
        `first_name ILIKE '%${data.search}%' OR last_name ILIKE '%${data.search}%' OR email ILIKE '%${data.search}%'`,
      )
      .skip(data.start)
      .take(data.length)
      .getMany();
  }

  //======================================================================DELETE SECTION

  async delete_soft(uid: string) {
    const deleteResult = await this.userRepo.softDelete(uid);
    if (deleteResult) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }

  async delete_hard(uid: string) {
    const deleteResult = await this.userRepo.delete({ uid: uid });
    if (deleteResult) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }

  //======================================================================INSERT SECTION

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_ADD}`,
    queue: 'user_service_add',
    errorHandler: ackErrorHandler,
  })
  async insert(data: UserDTO) {
    const check = await this.check_dup(data.email);
    if (!check) {
      const saltOrRounds = 10;
      const password = data.password;
      data.password = await bcrypt.hash(password, saltOrRounds);

      const result = await this.userRepo.save(data);
      if (result) {
        return userCreateRequestSuccess;
      } else {
        return userCreateRequestFailed;
      }
    } else {
      return userCreateRequestDup;
    }
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_EDIT}`,
    queue: 'user_service_edit',
    errorHandler: ackErrorHandler,
  })
  async update(data: UserDTO) {
    const check = await this.detail(data.uid);
    if (check) {
      const saltOrRounds = 10;
      const password = data.password;
      data.password = await bcrypt.hash(password, saltOrRounds);
      const result = await this.userRepo.save(data);
      if (result) {
        return userUpdateRequestSuccess;
      } else {
        return userUpdateRequestFailed;
      }
    } else {
      return userNotFound;
    }
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: 'user_login',
    queue: 'user_service_login',
    errorHandler: ackErrorHandler,
  })
  async login_rmq(data: UserLoginDTO) {
    const localLogin = await this.login(data);
    if (localLogin === userLoginRequestSuccess) {
      const loginToken = await this.amqpConnection.request<tokenRMQResponse>({
        exchange: `${process.env.AUTH_EXCHANGE_NAME}`,
        routingKey: `${process.env.AUTH_ROUTING_KEY_AUTH}`,
        payload: {
          uid: localLogin.user.uid,
        },
      });

      if (loginToken.token !== '') {
        localLogin.token = loginToken.token;
        return localLogin;
      } else {
        return userLoginRequestFailed;
      }
    } else {
      return userLoginRequestFailed;
    }
  }

  async login(data: UserLoginDTO) {
    const check = await this.check_dup(data.email);
    if (check) {
      const isMatch = await bcrypt.compare(data.password, check.password);
      if (isMatch) {
        userLoginRequestSuccess.user = check;
        return userLoginRequestSuccess;
      } else {
        return userLoginRequestFailed;
      }
    } else {
      return userLoginRequestFailed;
    }
  }
}
