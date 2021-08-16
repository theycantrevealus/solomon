import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogActivity } from '../model/log.activity';
import { LogActivityDTO } from './log-activity.dto';
import { Repository } from 'typeorm';

@Injectable()
export class LogActivityService {
  constructor(
    @InjectRepository(LogActivity)
    private readonly repo: Repository<LogActivity>,
  ) {}

  public async getAll(): Promise<LogActivityDTO[]> {
    return await this.repo
      .find()
      .then((items) => items.map((e) => LogActivityDTO.createEntity(e)));
  }

  public async create(dto: LogActivityDTO): Promise<LogActivityDTO> {
    return this.repo.save(LogActivityDTO.createEntity(dto));
  }
}
