import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../user.interface';

export class LoginUserResponseDto {
  @ApiProperty({ example: 'user_login_success' })
  message: string;
  @ApiProperty({
    example: {
      user: {
        uid: '741988b3-506c-454d-841c-4ed5e1c87ea8',
        email: 'hendrytanaka@pondokcoder.com',
        first_name: 'Hendry',
        last_name: 'Tanaka',
      },
    },
    nullable: true,
  })
  data: {
    user: IUser | null;
    token: string;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
