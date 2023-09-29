/* eslint-disable camelcase */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email_verification_token?: string;

  email_token_time?: Date;

  email_verified?: boolean;

  forgot_password_token?: string;

  password_token_time?: Date;

  demo_token_access_time?: Date;
}
