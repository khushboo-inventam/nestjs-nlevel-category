import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  LOGIN,
  PASSWORD_SALT_ROUNDS,
  REGISTER,
  RESET_PASSWORD,
} from '../common/global-constants';
import { stringCreate } from '../common/utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,

    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,

    @Inject(forwardRef(() => UserSessionsService))
    private userSessionsService: UserSessionsService,
  ) {}

  async validateNewUser(where): Promise<any> {
    const user = await this.usersService.findOne(where);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const payload = {
      email: user.email,
      user_id: user.user_id,
      full_name: user.full_name,
    };
    const userLogin = {
      public_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('app.jwt.refresh_token_expiration'),
      }),
    };

    await this.userSessionsService.create({
      access_token: userLogin.access_token,
      refresh_token: userLogin.refresh_token,
      is_expired: false,
      is_deleted: false,
      user_id: user.user_id,
      user_agent: '',
    });
    return { ...userLogin, already_logged_in: false };
  }

  async expireSession(where): Promise<any> {
    const session = await this.userSessionsService.update(where, {
      is_expired: true,
    });
    return session;
  }

  async existingSession(userId): Promise<any> {
    const session = await this.userSessionsService.findOne({
      user_id: userId,
      is_expired: false,
      is_deleted: false,
    });
    if (!session) {
      return false;
    }
    return session;
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const hash = await bcrypt.hash(
      createUserDto.password,
      PASSWORD_SALT_ROUNDS,
    );
    const payload = { ...createUserDto, ...{ password: hash } };
    const user = await this.usersService.create(payload);
    return { ...user };
  }

  async createEmailToken(email: string) {
    const emailVerification = await this.usersService.findOne({ email });
    if (!emailVerification)
      throw new HttpException(
        REGISTER.USER_NOT_REGISTERED,
        HttpStatus.FORBIDDEN,
      );
    if (
      emailVerification.email_token_time &&
      (Date.now() - parseInt(emailVerification.email_token_time, 10)) / 60000 <
        1
    ) {
      throw new HttpException(
        REGISTER.EMAIL_SENDED_RECENTLY,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const emailVerificationModel = await this.usersService.update(
      emailVerification.user_id,
      {
        email_verification_token: stringCreate(32), // Generate 7 digits number
        email_token_time: Date.now(),
      },
    );
    return emailVerificationModel;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerify = await this.usersService.findOne({
      email_verification_token: token,
    });
    if (!emailVerify)
      throw new HttpException(
        REGISTER.INVALID_VERIFICATION_LINK,
        HttpStatus.NOT_FOUND,
      );
    if (emailVerify.email_verified) {
      throw new HttpException(
        REGISTER.EMAIL_ALREADY_VERIFIED,
        HttpStatus.FORBIDDEN,
      );
    }
    const now = +new Date();
    const tokenCreatedAt = +emailVerify.email_token_time;
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - tokenCreatedAt >= oneDay)
      throw new HttpException(
        REGISTER.EMAIL_VERIFICATION_EXPIRED,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    await this.usersService.update(emailVerify.user_id, {
      email_verified: true,
    });
    return true;
  }

  async sendEmailVerification(email: string) {
    const model = await this.createEmailToken(email);

    if (!model)
      throw new HttpException(
        REGISTER.USER_NOT_REGISTERED,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    // if (this.configService.get('app.nodeEnv') !== 'test')
    // this.emailProducerService.sendVerificationEmail(model);
  }

  async createForgottenPasswordToken(email: string): Promise<any> {
    const forgottenPassword = await this.usersService.findOne({
      email,
    });
    if (
      forgottenPassword &&
      forgottenPassword.password_token_time &&
      (Date.now() - parseInt(forgottenPassword.password_token_time, 10)) /
        60000 <
        15
    )
      throw new HttpException(
        REGISTER.EMAIL_SENDED_RECENTLY,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const forgottenPasswordModel = await this.usersService.update(
      forgottenPassword.user_id,
      {
        forgot_password_token: stringCreate(32), // Generate 7 digits number,
        password_token_time: Date.now(),
      },
    );
    if (!forgottenPasswordModel)
      throw new HttpException(
        'LOGIN.ERROR.GENERIC_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return forgottenPasswordModel;
  }

  async sendEmailForgotPassword(email: string) {
    const userFromDb = await this.usersService.findOne({ email });
    // const bbUserData = await this.usersService.checkBbUser({ email });
    if (!userFromDb)
      throw new HttpException(LOGIN.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (!userFromDb.email_verified)
      throw new HttpException(
        REGISTER.EMAIL_UNVERIFIED,
        HttpStatus.UNAUTHORIZED,
      );
    const tokenModel = await this.createForgottenPasswordToken(email);

    if (!tokenModel)
      throw new HttpException(
        REGISTER.USER_NOT_REGISTERED,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    // this.emailProducerService.sendForgotPasswordEmail(tokenModel);
  }

  async checkPasswordToken(token: string): Promise<any> {
    const userFromDb = await this.usersService.findOne({
      forgot_password_token: token,
    });
    if (!userFromDb)
      throw new HttpException(
        RESET_PASSWORD.INVALID_LINK,
        HttpStatus.FORBIDDEN,
      );
    const now = +new Date();
    const tokenCreatedAt = +new Date(
      Date.parse(userFromDb.password_token_time.toString()),
    );
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - tokenCreatedAt >= oneDay)
      throw new HttpException(
        RESET_PASSWORD.LINK_EXPIRED,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return userFromDb;
  }

  async resolveRefreshToken(encoded: string): Promise<any> {
    const payload = await this.jwtService.verify(encoded);

    const sessionToken = await this.userSessionsService.findOne({
      refresh_token: encoded,
      user_id: payload.sub,
      is_deleted: false,
    });

    if (!sessionToken)
      throw new HttpException(
        LOGIN.REFRESH_TOKEN_NOT_FOUND,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if (sessionToken.is_expired) {
      const otherSession = await this.existingSession(payload.sub);
      if (!otherSession)
        throw new HttpException(
          LOGIN.REFRESH_TOKEN_EXPIRED,
          HttpStatus.FORBIDDEN,
        );
      throw new HttpException(
        LOGIN.REFRESH_TOKEN_REVOKED,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersService.findOne({
      email: payload.email,
      is_deleted: false,
    });

    if (!user)
      throw new HttpException(
        LOGIN.REFRESH_TOKEN_MALFORMED,
        HttpStatus.FORBIDDEN,
      );

    return user;
  }
}
