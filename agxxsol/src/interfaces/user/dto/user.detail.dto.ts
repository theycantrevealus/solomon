import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DetailUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: '43dea7eb-11ea-4782-8cb8-95353cc48884',
  })
  @IsUUID()
  @IsString()
  uid: string;
}
