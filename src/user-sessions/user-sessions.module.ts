import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsService } from './user-sessions.service';

import { UserSessions } from './entities/user-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSessions])],

  providers: [UserSessionsService],
})
export class UserSessionsModule {}
