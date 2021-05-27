import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(Number(id));
  }

  @Post()
  create(@Body() game: CreateGameDto) {
    return this.gamesService.create(game);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() game: UpdateGameDto) {
    return this.gamesService.update(Number(id), game);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(Number(id));
  }
}
