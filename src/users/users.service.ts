import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/userNotFoundException';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new UserNotFoundException({ id: id });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new UserNotFoundException({ email: email });
  }

  async create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async update(id: number, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFoundException({ id: id });
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UserNotFoundException({ id: id });
    }
    await this.usersRepository.delete(id);
    return {};
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
