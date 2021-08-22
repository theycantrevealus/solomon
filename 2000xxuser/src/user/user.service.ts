import { HttpStatus, Injectable } from '@nestjs/common';
import { ackErrorHandler, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import env = require('dotenv');
import { UserDTO } from '../interfaces/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../model/user.model';
import { getConnection, Repository } from 'typeorm';
env.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
  ) {}
  async user_duplicate_check(email: string) {
    return await getConnection()
      .getRepository(UserModel)
      .createQueryBuilder('user')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere('email = :email')
      .setParameters({ email: email })
      .getOne();
  }
  async user_detail(uid: string) {
    return await this.repo.findOne(uid);
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_DETAIL}`,
    queue: 'user_service_detail',
    errorHandler: ackErrorHandler,
  })
  async get_user_detail(data: any) {
    const result = await this.user_detail(data.uid);
    return {
      status: HttpStatus.OK,
      message: 'user_get_by_id_success',
      user: result,
      error: null,
    };
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_ADD}`,
    queue: 'user_service_add',
    errorHandler: ackErrorHandler,
  })
  async user_add(userDTO: UserDTO) {
    const check = await this.user_duplicate_check(userDTO.email);
    if (!check) {
      const saltOrRounds = 10;
      const password = userDTO.password;
      userDTO.password = await bcrypt.hash(password, saltOrRounds);

      userDTO.uid = uuid();
      userDTO.created_at = new Date().toISOString();
      userDTO.updated_at = new Date().toISOString();

      const createdResult = await this.repo.save(UserDTO.createModel(userDTO));
      return {
        status: HttpStatus.CREATED,
        message: 'user_create_success',
        user: createdResult,
        error: null,
      };
    } else {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'user_duplicated',
        user: userDTO,
        error: null,
      };
    }
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_EDIT}`,
    queue: 'user_service_edit',
    errorHandler: ackErrorHandler,
  })
  async user_edit(userDTO: UserDTO) {
    const saltOrRounds = 10;
    const password = userDTO.password;
    userDTO.password = await bcrypt.hash(password, saltOrRounds);
    userDTO.updated_at = new Date().toISOString();
    const editProcess = await this.repo.update(userDTO.uid, userDTO);
    const editResult = await this.user_detail(userDTO.uid);
    if (editProcess) {
      return {
        status: HttpStatus.CREATED,
        message: 'user_update_success',
        user: editResult,
        error: null,
      };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_update_failed',
        user: editResult,
        error: null,
      };
    }
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: 'user_login',
    queue: 'user_service_login',
    errorHandler: ackErrorHandler,
  })
  async user_login({ email, password }) {
    const check = await this.user_duplicate_check(email);
    if (check) {
      const isMatch = await bcrypt.compare(password, check.password);
      if (isMatch) {
        return {
          status: HttpStatus.ACCEPTED,
          message: 'login_success',
          user: check,
          error: null,
        };
      } else {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'login_failed',
          user: null,
          error: null,
        };
      }
    } else {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'login_failed',
        user: null,
        error: null,
      };
    }
  }
}
