import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CHANGE_PASSWORD } from '../../common/global-constants';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Enter old password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/, {
    message: CHANGE_PASSWORD.NEW_PASSWORD_VALIDATION,
  })
  old_password: string;

  @ApiProperty({ description: 'Enter new password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/, {
    message: CHANGE_PASSWORD.NEW_PASSWORD_VALIDATION,
  })
  new_password: string;
}
