import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { UserSessions } from '../user-sessions/entities/user-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserSessions]),

    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwt.expiration'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AuthService,
    UsersService,
    JwtStrategy,
    ConfigService,
    UserSessionsService,
  ],
})
export class AuthModule {}
