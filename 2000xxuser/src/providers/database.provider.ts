import { createConnection } from 'typeorm';
import { UserModel } from '../model/user.model';
import { configService } from '../config/orm.config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: `${process.env.POSTGRES_HOST}`,
        port: parseInt(process.env.POSTGRES_PORT),
        username: `${process.env.POSTGRES_USER}`,
        password: `${process.env.POSTGRES_PASSWORD}`,
        database: `${process.env.POSTGRES_DATABASE}`,
        entities: configService.getTypeOrmConfig().entities,
      }),
  },
];
