import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'hendrytanaka@pondokcoder.com',
  })
  @IsString()
  email: string;

  @IsString()
  @ApiProperty({
    example: 'Hendry',
  })
  first_name: string;

  @ApiProperty({
    example: 'Tanaka',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    minLength: 6,
    example: 'test11',
  })
  @IsString()
  password: string;
}
