import { Injectable } from '@nestjs/common';
import { UserModel } from '../model/user.model';
import { UserDTO } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
  ) {}

  public async getAll(): Promise<UserDTO[]> {
    return getConnection()
      .getRepository(UserModel)
      .createQueryBuilder('user')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .getMany();
  }

  public async getPaging(data: any): Promise<UserDTO[]> {
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

  public async getDetail(uid: string): Promise<UserDTO> {
    return await this.repo.findOne(uid);
  }

  public async insert(userDTO: UserDTO): Promise<UserDTO> {
    return this.repo.save(UserDTO.createModel(userDTO));
  }

  public async update(userDTO: UserDTO): Promise<UserDTO> {
    return this.repo.save(UserDTO.createModel(userDTO));
  }
}
