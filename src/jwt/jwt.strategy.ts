import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserSessionsService } from '../user-sessions/user-sessions.service';

interface User {
  user_id: string;
  email: string;
  full_name: string;
}
export interface RequestCustom extends Request {
  user: User;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userSessionsService: UserSessionsService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwt.secret'),
    });
  }

  async validate(request: Request, user: any) {
    const { authorization } = request.headers as any;
    let validateUser: User = {
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
    };
    const session = await this.userSessionsService.findOne({
      access_token: authorization,
      user_id: user.user_id,
      is_expired: false,
      is_deleted: false,
    });

    if (!session) {
      validateUser = null;
    }

    return validateUser;
  }
}
