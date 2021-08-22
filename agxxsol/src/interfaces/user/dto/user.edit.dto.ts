import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: '741988b3-506c-454d-841c-4ed5e1c87ea8',
  })
  @IsString()
  uid: string;

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
