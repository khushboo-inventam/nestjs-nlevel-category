import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CHANGE_PASSWORD } from '../../common/global-constants';

// import { IsAlphanumericWithSpace } from '../../common/custom-validators/alpha-numeric-with-space';
//   import { CHANGE_PASSWORD } from '../common/global-constants';

export class CreateUserDto {
  @ApiProperty({ description: 'Enter the full name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  // @IsAlphanumericWithSpace('fullname')
  full_name: string;

  @ApiProperty({ description: 'Enter the personal email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Enter the password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/, {
    message: CHANGE_PASSWORD.NEW_PASSWORD_VALIDATION,
  })
  password: string;

  @ApiProperty({ description: 'Enter the personal Mobile number' })
  @IsOptional()
  // @MinLength(6)
  // @MaxLength(15)
  mobile_no: string;
}
