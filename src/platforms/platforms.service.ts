import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { Platform } from './platform.interface';

@Injectable()
export class PlatformsService {
  private lastPlatformId = 0;
  private platforms: Platform[] = [];

  findAll() {
    return this.platforms;
  }

  findOne(id: number) {
    const platform = this.platforms.find((platform) => platform.id === id);
    if (platform) {
      return platform;
    }
    throw new HttpException('Platform not found', HttpStatus.NOT_FOUND);
  }

  create(platform: CreatePlatformDto) {
    const newPlatform = {
      id: ++this.lastPlatformId,
      ...platform,
    };
    this.platforms.push(newPlatform);
    return newPlatform;
  }

  update(id: number, platform: UpdatePlatformDto) {
    const platformIndex = this.platforms.findIndex(
      (platform) => platform.id === id,
    );
    if (platformIndex > -1) {
      this.platforms[platformIndex] = platform;
      return platform;
    }
    throw new HttpException('Platform not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const platformIndex = this.platforms.findIndex(
      (platform) => platform.id === id,
    );
    if (platformIndex > -1) {
      this.platforms.splice(platformIndex, 1);
    } else {
      throw new HttpException('Platform not found', HttpStatus.NOT_FOUND);
    }
  }
}
