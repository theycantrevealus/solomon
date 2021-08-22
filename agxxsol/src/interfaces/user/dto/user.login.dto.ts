import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'hendrytanaka@pondokcoder.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    minLength: 6,
    example: 'test11',
  })
  @IsString()
  password: string;
}
