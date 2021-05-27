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

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformsService.findOne(Number(id));
  }

  @Post()
  create(@Body() platform: CreatePlatformDto) {
    return this.platformsService.create(platform);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() platform: UpdatePlatformDto) {
    return this.platformsService.update(Number(id), platform);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformsService.remove(Number(id));
  }
}
