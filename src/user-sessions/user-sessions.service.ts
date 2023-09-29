import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSessions } from './entities/user-session.entity';

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSessions)
    private readonly repo: Repository<UserSessions>,
  ) {}

  create(createUserDto) {
    return this.repo.save(createUserDto);
  }

  findAll() {
    return this.repo.find({ where: { is_deleted: false } });
  }

  findOne(findOptions: any) {
    return this.repo.findOne({ where: findOptions });
  }

  update(where, updateUserDto) {
    return this.repo.update(where, updateUserDto);
  }

  remove(id: number) {
    return this.repo.update({ id }, { is_deleted: true });
  }
}
