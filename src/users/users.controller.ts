import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneParams } from '../utils/findOneParams';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.usersService.findOneById(Number(id));
  }

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Patch(':id')
  update(@Param() { id }: FindOneParams, @Body() user: UpdateUserDto) {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() { id }: FindOneParams) {
    return this.usersService.remove(Number(id));
  }
}
