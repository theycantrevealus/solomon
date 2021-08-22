import { Transport } from '@nestjs/microservices';
import env = require('dotenv');
env.config();
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_GATEWAY_PORT;
    this.envConfig.tokenService = {
      options: {
        port: process.env.SERVICE_TOKEN_PORT,
        host: process.env.SERVICE_TOKEN_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.userService = {
      options: {
        port: process.env.SERVICE_USER_PORT,
        host: process.env.SERVICE_USER_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.permissionService = {
      options: {
        port: process.env.SERVICE_PERMISSION_PORT,
        host: process.env.SERVICE_PERMISSION_HOST,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
