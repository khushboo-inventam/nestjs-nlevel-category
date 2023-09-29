import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ACTIONS, CHANGE_PASSWORD } from '../common/global-constants';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiSecurity('access_token')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ user_id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('update-profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateProfileDto,
  ) {
    const updateData = await this.usersService.update(+id, updateClientDto);
    return {
      data: updateData,
      message: ACTIONS.UPDATED,
    };
  }

  @Patch('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userDetail = await this.usersService.findOne({ user_id: +id });
    if (!userDetail)
      throw new HttpException(
        ACTIONS.NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const user = await this.usersService.validateUser(
      userDetail.email,
      updatePasswordDto.old_password,
    );
    if (!user)
      throw new HttpException(
        CHANGE_PASSWORD.PASSWORD_NOT_MATCH,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const updateData = await this.usersService.setPassword(
      +id,
      updatePasswordDto.new_password,
    );
    return {
      data: updateData,
      message: ACTIONS.UPDATED,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
