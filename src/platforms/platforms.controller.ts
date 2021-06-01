import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { FindOneParams } from '../utils/findOneParams';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.platformsService.findOneById(Number(id));
  }

  @Post()
  create(@Body() platform: CreatePlatformDto) {
    return this.platformsService.create(platform);
  }

  @Patch(':id')
  update(@Param() { id }: FindOneParams, @Body() platform: UpdatePlatformDto) {
    return this.platformsService.update(Number(id), platform);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.platformsService.remove(Number(id));
  }
}
