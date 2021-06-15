import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FindOneParams } from '../utils/findOneParams';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.gamesService.findOneById(Number(id));
  }

  @Post()
  create(@Body() game: CreateGameDto) {
    return this.gamesService.create(game);
  }

  @Patch(':id')
  update(@Param() { id }: FindOneParams, @Body() game: UpdateGameDto) {
    return this.gamesService.update(Number(id), game);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() { id }: FindOneParams) {
    return this.gamesService.remove(Number(id));
  }
}
