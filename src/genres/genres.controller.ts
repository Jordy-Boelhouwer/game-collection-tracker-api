import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOneById(Number(id));
  }

  @Post()
  create(@Body() genre: CreateGenreDto) {
    return this.genresService.create(genre);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() genre: UpdateGenreDto) {
    return this.genresService.update(Number(id), genre);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.remove(Number(id));
  }
}
