import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserModel } from '../model/user.model';
import { UserService } from './user.service';
import { Crud } from '@nestjsx/crud';
import { UserDTO } from '../dto/user.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Crud({
  model: {
    type: UserModel,
  },
})
@Controller('user')
export class UserController {
  constructor(
    private service: UserService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Get()
  public async getAll() {
    return await this.service.getAll();
  }

  @Get(':uid')
  public async getByUID(@Param('uid') uid: string) {
    return await this.service.getDetail(uid);
  }

  @Post('paging')
  async getPaging(@Body() data) {
    return this.service.getPaging(data);
  }

  @Put('edit')
  async update(@Body() data) {
    const saltOrRounds = 10;
    const password = data.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    data.password = hash;
    return this.service.update(UserDTO.from(data)).then(() => {
      this.amqpConnection.publish('pdc_user', 'user_update', data);
    });
  }

  @Post('add')
  async insert(@Body() data) {
    const saltOrRounds = 10;
    const password = data.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    data.uid = uuid();
    data.password = hash;
    data.created_at = new Date().toISOString();
    data.updated_at = new Date().toISOString();
    return this.service.insert(UserDTO.from(data)).then(() => {
      this.amqpConnection.publish('pdc_user', 'user_registration', data);
    });
  }

  @Delete(':uid')
  async delete(@Param('uid') uid: string) {
    const data = await this.service.getDetail(uid);
    data.deleted_at = new Date().toISOString();
    return this.service.update(UserDTO.from(data)).then(() => {
      this.amqpConnection.publish('pdc_user', 'user_delete', uid);
    });
  }
}
