import { HttpStatus, Injectable } from '@nestjs/common';
import { ackErrorHandler, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import env = require('dotenv');
import { UserDTO } from '../interfaces/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../model/user.model';
import { getConnection, IsNull, Not, Repository } from 'typeorm';
import {
  userCreateRequestDup,
  userCreateRequestSuccess,
} from '../../test/user/mocks/user.add.mocks';
import {
  userEditRequestFailed,
  userEditRequestNotFound,
  userEditRequestSuccess,
} from '../../test/user/mocks/user.edit.mock';
import {
  userDeleteRequestFailed,
  userDeleteRequestSuccess,
} from '../../test/user/mocks/user.delete.mock';
import {
  userLoginRequestFailed,
  userLoginRequestSuccess,
} from '../../test/user/mocks/user.login.mock';
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
    return await this.repo.findOne({ where: { uid: uid, deleted_at: null } });
  }
  async user_delete_soft(uid: string) {
    const deleteResult = await this.repo.softDelete(uid);
    if (deleteResult) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }
  async user_delete_hard(uid: string) {
    const deleteResult = await this.repo.delete({ uid: uid });
    if (deleteResult) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }
  async user_all_deleted(): Promise<UserDTO[]> {
    return await this.repo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
    });
  }
  async user_all(): Promise<UserDTO[]> {
    return await this.repo.find({ deleted_at: null });
  }
  async getPaging(data: any): Promise<UserDTO[]> {
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
    /*return await this.repo
      .find()
      .then((items) => items.map((e) => UserDTO.createModel(e)));*/
  }
  //================================================================================================================================= RMQ TRANSACTION
  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_DETAIL}`,
    queue: 'user_service_detail',
    errorHandler: ackErrorHandler,
  })
  async get_user_detail(data: any) {
    if (data.uid) {
      const result = await this.user_detail(data.uid);
      if (result) {
        return {
          status: HttpStatus.OK,
          message: 'user_get_by_id_success',
          user: result,
          error: null,
        };
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'user_get_by_id_not_found',
          user: {},
          error: `User not found. Please make sure the uid is correct. uid : ${data.uid}`,
        };
      }
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user_get_by_id_not_found',
        user: {},
        error: `User not found. Please make sure the uid is correct. uid : ${data.uid}`,
      };
    }
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
      userDTO.created_at = new Date();
      userDTO.updated_at = new Date();

      const createdResult = await this.repo.save(UserDTO.createModel(userDTO));
      userCreateRequestSuccess.user = userDTO;
      return userCreateRequestSuccess;
    } else {
      userCreateRequestDup.user = userDTO;
      return userCreateRequestDup;
    }
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_EDIT}`,
    queue: 'user_service_edit',
    errorHandler: ackErrorHandler,
  })
  async user_edit(userDTO: UserDTO) {
    const check = await this.user_detail(userDTO.uid);
    if (check) {
      const saltOrRounds = 10;
      const password = userDTO.password;
      check.password = await bcrypt.hash(password, saltOrRounds);
      check.updated_at = new Date();
      const editProcess = await this.repo.update(
        userDTO.uid,
        UserDTO.createModel(check),
      );
      const editResult = await this.user_detail(userDTO.uid);
      if (editProcess) {
        userEditRequestSuccess.user = editResult;
        return userEditRequestSuccess;
      } else {
        userEditRequestFailed.user = editResult;
        return userEditRequestFailed;
      }
    } else {
      return userEditRequestNotFound;
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
