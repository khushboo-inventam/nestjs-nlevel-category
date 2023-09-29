import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  ERROR,
  PASSWORD_SALT_ROUNDS,
  REGISTER,
} from '../common/global-constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly repo: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    // return 'This action adds a new user';
    return this.repo.save(createUserDto);
  }

  findAll(where?) {
    const whereCondition = { is_deleted: false };
    if (where && where !== undefined) {
      Object.assign(whereCondition, where);
    }
    return this.repo.find({
      where: whereCondition,
      order: {
        created_at: 'ASC',
      },
    });
  }

  findOne(findOptions: any) {
    // return `This action returns a #${id} user`;
    return this.repo.findOne({ where: findOptions });
  }

  update(id: number, updateUserDto: any) {
    return this.repo.update({ user_id: id }, updateUserDto);
  }

  async updateByCondition(where, updateUserDto) {
    return this.repo.update(where, updateUserDto);
  }

  remove(id: number) {
    return this.repo.update({ user_id: id }, { is_deleted: true });
  }

  async setPassword(id: number, password: string): Promise<any> {
    const hash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
    const user = await this.update(id, {
      password: hash,
      forgot_password_token: null,
    });
    if (!user) {
      throw new HttpException(
        ERROR.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findOne({ email });
    // console.log('user', user)
    if (!user)
      //     throw new RpcException({
      //       message:  REGISTER.USER_NOT_REGISTERED,
      //       statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      // });

      throw new HttpException(
        REGISTER.USER_NOT_REGISTERED,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }
    const result = { ...user };
    delete result.password;
    return result;
  }
}
