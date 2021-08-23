import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import 'jest-extended';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/orm.config';
import { UserModel } from '../model/user.model';
import env = require('dotenv');
import { getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { databaseProviders } from '../providers/database.provider';
env.config();

describe('[User Service]', () => {
  let service: UserService;
  let userRepo: Repository<UserModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
          exchanges: [
            {
              name: `${process.env.USER_EXCHANGE_NAME}`,
              type: `${process.env.USER_EXCHANGE_TYPE}`,
            },
          ],
          uri: `${process.env.AMQP_CONNECTION}`,
        }),
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([UserModel], 'default'),
      ],
      providers: [UserService, ...databaseProviders],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(UserModel));
  });

  beforeEach(async () => {});

  it('[STATE] Service should started', () => {
    expect(service).toBeDefined();
  });

  describe('GET Active User List', () => {
    it('should return all active user', async () => {
      //Insert data for check
      const saltOrRounds = 10;
      const password = await bcrypt.hash('password', saltOrRounds);
      const sampleData = {
        uid: uuid(),
        email: 'hendrytanaka@pondokcoder.com',
        first_name: 'Hendry',
        last_name: 'Tanaka',
        password: password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await userRepo.insert(sampleData);
      const dataResult = await userRepo.find();
      expect(dataResult).toBeArray();
    });
  });

  afterAll(async () => {
    //Clear Unit Testing Data
    const dataResult = await userRepo.find();
    dataResult.forEach((item) => {
      userRepo.delete(item.uid);
    });
    await getConnection().close();
  });
});
