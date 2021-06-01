import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { Platform } from './entities/platform.entity';
import { PlatformNotFoundException } from './exceptions/platformNotFound.exception';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformsRepository: Repository<Platform>,
  ) {}

  findAll() {
    return this.platformsRepository.find();
  }

  async findOneById(id: number) {
    const platform = await this.platformsRepository.findOne(id);
    if (platform) {
      return platform;
    }
    throw new PlatformNotFoundException(id);
  }

  async create(platform: CreatePlatformDto) {
    const newPlatform = this.platformsRepository.create(platform);
    await this.platformsRepository.save(newPlatform);
    return newPlatform;
  }

  async update(id: number, platform: UpdatePlatformDto) {
    await this.platformsRepository.update(id, platform);
    const updatedPlatform = await this.platformsRepository.findOne(id);
    if (updatedPlatform) {
      return updatedPlatform;
    }
    throw new PlatformNotFoundException(id);
  }

  async remove(id: number) {
    const deleteResponse = await this.platformsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PlatformNotFoundException(id);
    }
  }
}
