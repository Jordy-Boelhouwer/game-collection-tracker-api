import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './game.interface';

@Injectable()
export class GamesService {
  private lastGameId = 0;
  private games: Game[] = [];

  findAll() {
    return this.games;
  }

  findOne(id: number) {
    const game = this.games.find((game) => game.id === id);
    if (game) {
      return game;
    }
    throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
  }

  create(game: CreateGameDto) {
    const newGame = {
      id: ++this.lastGameId,
      ...game,
    };
    this.games.push(newGame);
    return newGame;
  }

  update(id: number, game: UpdateGameDto) {
    const gameIndex = this.games.findIndex((game) => game.id === id);
    if (gameIndex > -1) {
      this.games[gameIndex] = game;
      return game;
    }
    throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const gameIndex = this.games.findIndex((game) => game.id === id);
    if (gameIndex > -1) {
      this.games.splice(gameIndex, 1);
    } else {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }
  }
}
