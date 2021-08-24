import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserService } from '../../src/user/user.service';
import { UserController } from '../../src/user/user.controller';
import { AppModule } from '../../src/app.module';
import { userAdd, userLoginFailed, userLoginSuccess } from '../mocks/user.mock';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { INestApplication } from '@nestjs/common';

describe('[e2e - LOGIN SERVICE]', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('[LOGIN SUCCESS] should return user login success', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(userLoginSuccess)
      .expect(201);
  });

  it('[LOGIN FAILED] should return user login failed', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(userLoginFailed)
      .expect(403);
  });
});
