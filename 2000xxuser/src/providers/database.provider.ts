import { createConnection, getConnection } from 'typeorm';
import { configService } from '../config/orm.config';

export const connection = {
  async create() {
    return await createConnection({
      name: 'default',
      type: 'postgres',
      host: `${process.env.POSTGRES_HOST}`,
      port: parseInt(process.env.POSTGRES_PORT),
      username: `${process.env.POSTGRES_USER}`,
      password: `${process.env.POSTGRES_PASSWORD}`,
      database: `${process.env.POSTGRES_DATABASE}`,
      entities: configService.getTypeOrmConfig().entities,
    });
  },
  async close() {
    await getConnection().close();
  },
};
