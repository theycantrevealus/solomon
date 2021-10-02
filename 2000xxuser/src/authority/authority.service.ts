import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import {
  ackErrorHandler,
  AmqpConnection,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { UserAuthorityModel } from '../model/user.authority.model';
import { AuthorityDTO } from '../interfaces/dto/authority.dto';
import {
  authorityCreateRequestDup,
  authorityCreateRequestFailed,
  authorityCreateRequestSuccess,
} from '../interfaces/dto/authority.response.dto';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(UserAuthorityModel)
    private readonly authorityRepo: Repository<UserAuthorityModel>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async check_dup(name: string) {
    return await getConnection()
      .getRepository(UserAuthorityModel)
      .createQueryBuilder('user_authority')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere('name = :name')
      .setParameters({ name: name })
      .getOne();
  }

  @RabbitRPC({
    exchange: `${process.env.USER_EXCHANGE_NAME}`,
    routingKey: `${process.env.USER_ROUTING_KEY_ADD}`,
    queue: 'authority_add',
    errorHandler: ackErrorHandler,
  })
  async insert(data: AuthorityDTO) {
    const check = await this.check_dup(data.name);
    if (!check) {
      const result = await this.authorityRepo.save(data);
      if (result) {
        return authorityCreateRequestSuccess;
      } else {
        return authorityCreateRequestFailed;
      }
    } else {
      return authorityCreateRequestDup;
    }
  }
}
