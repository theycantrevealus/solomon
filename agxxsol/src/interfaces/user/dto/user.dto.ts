import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'takashitanaka@pondokcoder.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    minLength: 6,
    example: '123',
  })
  @IsString()
  password: string;
}
