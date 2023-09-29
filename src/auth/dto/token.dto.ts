// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  // @ApiProperty({ description: 'Enter the Email' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
