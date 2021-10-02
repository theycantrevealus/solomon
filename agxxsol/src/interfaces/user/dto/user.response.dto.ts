import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { InterfaceUser } from 'src/interfaces/user/user.interface';

export class LoginUserResponseDTO {
  @ApiProperty({ example: 200 })
  @IsNumber()
  status: number;

  @ApiProperty({ example: 'user_login_success' })
  @IsString()
  message: string;

  @ApiProperty({
    example: {
      uid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      email: 'example@domain.com',
      first_name: 'John',
      last_name: 'Doe',
    },
    nullable: true,
  })
  user: InterfaceUser;

  @ApiProperty({ example: 'ey...' })
  @IsString()
  token: string;

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
//===================================================================================================================
export class UserDetailResponseDTO {
  @ApiProperty({
    example: {
      uid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      email: 'example@domain.com',
      first_name: 'John',
      last_name: 'Doe',
    },
    nullable: true,
  })
  user: InterfaceUser;
}
//===================================================================================================================
export class UserListResponseDTO {
  @ApiProperty({
    example: [],
  })
  data: [];
}
