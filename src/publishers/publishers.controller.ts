import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { FindOneParams } from '../utils/findOneParams';

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Get()
  findAll() {
    return this.publishersService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.publishersService.findOneById(Number(id));
  }

  @Post()
  create(@Body() publisher: CreatePublisherDto) {
    return this.publishersService.create(publisher);
  }

  @Patch(':id')
  update(
    @Param() { id }: FindOneParams,
    @Body() publisher: UpdatePublisherDto,
  ) {
    return this.publishersService.update(Number(id), publisher);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.publishersService.remove(Number(id));
  }
}
