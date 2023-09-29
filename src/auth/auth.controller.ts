import { ConfigService } from '@nestjs/config';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseFilters,
  UsePipes,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUserDto } from './dto/login-user.dto';
import { Login } from './dto/login-response.dto';
import { TokenDto } from './dto/token.dto';
import { UsersService } from '../users/users.service';
import { ERROR, LOGIN, REGISTER } from '../common/global-constants';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MessageResponse } from '../common/dto/message.dto';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { Public } from '../jwt/jwt-auth.guard';

@ApiSecurity('access_token')
@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  public async emailVerificationAndExistingSession(user) {
    // if (!user.email_verified)
    //   throw new HttpException(
    //     REGISTER.EMAIL_UNVERIFIED,
    //     HttpStatus.UNAUTHORIZED,
    //   );
    const existingSession = await this.authService.existingSession(
      user.user_id,
    );
    if (existingSession) {
      const expiredSession = await this.authService.expireSession({
        user_id: user.user_id,
        is_expired: false,
        is_deleted: false,
      });

      if (!expiredSession)
        throw new HttpException(
          ERROR.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    const loginData = await this.authService.login(user);
    return {
      message: LOGIN.SUCCESS,
      data: loginData,
    };
  }

  @Public()
  @Post('login')
  // @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    // @Req() request,
  ): Promise<Login> {
    // console.log('loginUserDto', loginUserDto);
    const user = await this.usersService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user)
      throw new HttpException(LOGIN.INVALID_CRED, HttpStatus.UNAUTHORIZED);

    const emailVerification = await this.emailVerificationAndExistingSession(
      user,
      // request,
    );

    await this.authService.expireSession({
      user_id: user.id,
      is_expired: false,
      is_deleted: false,
    });

    return emailVerification;
  }

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<MessageResponse> {
    const user = await this.authService.validateNewUser({
      email: createUserDto.email,
    });
    if (user) throw new HttpException(REGISTER.USER_EXIST, HttpStatus.CONFLICT);

    const newUser = await this.authService.register(createUserDto);
    // this.authService.sendEmailVerification(newUser.email);

    if (!newUser)
      throw new HttpException(
        ERROR.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return { message: REGISTER.EMAIL_SENT_SUCCESS };
  }

  @Public()
  @Post('logout')
  public async logout(@Body() body: TokenDto): Promise<MessageResponse> {
    const { token } = body;

    const expiredSession = await this.authService.expireSession({
      access_token: token,
    });
    if (!expiredSession)
      throw new HttpException(
        ERROR.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      message: LOGIN.LOGOUT,
    };
  }
}
