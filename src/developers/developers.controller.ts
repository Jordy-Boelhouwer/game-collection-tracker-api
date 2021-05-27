import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  findAll() {
    return this.developersService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.developersService.findOne(Number(id));
  }

  @Post()
  create(@Body() developer: CreateDeveloperDto) {
    return this.developersService.create(developer);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() developer: UpdateDeveloperDto) {
    return this.developersService.update(Number(id), developer);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developersService.remove(Number(id));
  }
}
