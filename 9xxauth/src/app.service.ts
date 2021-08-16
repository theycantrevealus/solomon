import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async login(user: any) {
    const payload = { username: user.username, password: user.userId };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
